import { recallMemories } from "../hindsight/memory";
import { ConflictDetectionResult, TeachMemoryCategory } from "./types";

/**
 * Common strategic contradiction pairs in marketing and content strategy.
 */
const CONFLICT_DIMENSIONS: Array<{
  dimension: string;
  groupA: string[];
  groupB: string[];
}> = [
  {
    dimension: "format_length",
    groupA: ["concise", "brief", "short", "short-form", "punchy", "bite-sized"],
    groupB: ["long-form", "detailed", "comprehensive", "in-depth", "deep-dive", "extended"],
  },
  {
    dimension: "promotional_stance",
    groupA: ["not promotional", "educational rather than promotional", "avoid promotional", "non-promotional"],
    groupB: ["promotional", "sales-driven", "direct-response", "heavy marketing", "pitch-focused"],
  },
  {
    dimension: "tone_style",
    groupA: ["clear and approachable", "evidence-aware", "calm", "without the noise"],
    groupB: ["hype", "hyperbolic", "aggressive", "urgent", "flashy", "louder"],
  },
];

/**
 * Evaluates whether a proposed memory has contradictory polarity with existing memories.
 */
export async function detectMemoryConflict(
  content: string,
  category: TeachMemoryCategory
): Promise<ConflictDetectionResult> {
  const contentLower = content.toLowerCase();

  // Find if new content falls into a conflict dimension
  let detectedDimension: (typeof CONFLICT_DIMENSIONS)[number] | null = null;
  let matchesGroupA = false;

  for (const dim of CONFLICT_DIMENSIONS) {
    const hasA = dim.groupA.some((w) => contentLower.includes(w));
    const hasB = dim.groupB.some((w) => contentLower.includes(w));

    if (hasA && !hasB) {
      detectedDimension = dim;
      matchesGroupA = true;
      break;
    } else if (hasB && !hasA) {
      detectedDimension = dim;
      matchesGroupA = false;
      break;
    }
  }

  // If no dimension matched, no conflict detected
  if (!detectedDimension) {
    return {
      hasConflict: false,
      conflictingMemories: [],
    };
  }

  try {
    // Search existing memories for opposing terms
    const opposingTerms = matchesGroupA ? detectedDimension.groupB : detectedDimension.groupA;
    const searchQuery = opposingTerms.slice(0, 3).join(" ");
    const recallResult = await recallMemories(searchQuery);
    const candidateOpposites = recallResult.results ?? [];

    const conflictingMemories: Array<{ id: string; text: string; context?: string }> = [];

    for (const item of candidateOpposites) {
      const itemLower = item.text.toLowerCase();
      const hasOpposite = opposingTerms.some((t) => itemLower.includes(t));

      if (hasOpposite) {
        conflictingMemories.push({
          id: item.id,
          text: item.text,
          context: item.context,
        });
      }
    }

    if (conflictingMemories.length > 0) {
      return {
        hasConflict: true,
        conflictingMemories,
        explanation: `New preference introduces updated direction along the '${detectedDimension.dimension}' dimension. The existing memory remains preserved as historical context.`,
        suggestedContext: `Current Strategic Preference (${category})`,
      };
    }

    return {
      hasConflict: false,
      conflictingMemories: [],
    };
  } catch (error) {
    console.warn("[Conflict Detection] Error querying for memory conflicts:", error);
    return {
      hasConflict: false,
      conflictingMemories: [],
    };
  }
}
