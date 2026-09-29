import { recallMemories } from "../hindsight/memory";
import { SafeMemoryResult } from "../hindsight/types";

/**
 * Calculates Jaccard token similarity between two normalized strings.
 */
function calculateTokenSimilarity(a: string, b: string): number {
  const tokensA = new Set(
    a
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
  const tokensB = new Set(
    b
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) {
      intersection++;
    }
  }

  const union = new Set([...tokensA, ...tokensB]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Checks whether an equivalent strategic memory is already stored in Hindsight persistent bank.
 * Avoids duplicate records while allowing distinct or channel-specific refinements.
 */
export async function checkDuplicateMemory(
  normalizedContent: string
): Promise<{ isDuplicate: boolean; existingMemory?: SafeMemoryResult; similarity: number }> {
  try {
    const recallResult = await recallMemories(normalizedContent);
    const existingList = recallResult.results ?? [];

    const normalizedTarget = normalizedContent.toLowerCase().replace(/\s+/g, " ").trim();

    for (const item of existingList) {
      const existingText = item.text.toLowerCase().replace(/\s+/g, " ").trim();

      // 1. Exact string match
      if (existingText === normalizedTarget) {
        return {
          isDuplicate: true,
          existingMemory: item,
          similarity: 1.0,
        };
      }

      // 2. High token similarity match (> 0.85)
      const similarity = calculateTokenSimilarity(normalizedTarget, existingText);
      if (similarity >= 0.85) {
        return {
          isDuplicate: true,
          existingMemory: item,
          similarity,
        };
      }
    }

    return { isDuplicate: false, similarity: 0 };
  } catch (error) {
    // If recall fails during duplicate check, log warning and allow proceeding safely
    console.warn("[Deduplication] Failed to query existing memories for duplicate check:", error);
    return { isDuplicate: false, similarity: 0 };
  }
}
