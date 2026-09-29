import { getHindsightClient } from "../hindsight/client";
import { HINDSIGHT_CONFIG } from "../hindsight/config";
import { getMemoryStatus } from "../hindsight/memory";
import { validateTeachMemoryRequest } from "./validation";
import { normalizeTeachContent, normalizeTeachContext } from "./normalization";
import { checkDuplicateMemory } from "./deduplication";
import { detectMemoryConflict } from "./conflict";
import { TeachMemoryResult } from "./types";

/**
 * Teaches Northstar a durable strategic preference or brand rule.
 *
 * Pipeline Order:
 * 1. Validate input schema & length limits (Zod)
 * 2. Scan for credentials / secrets (Secret Detection)
 * 3. Neutralize prompt-injection commands
 * 4. Verify Hindsight Cloud connection
 * 5. Normalize content formatting & strip HTML/XML tags
 * 6. Deduplicate against existing Hindsight persistent storage
 * 7. Assess semantic conflicts (preserve historical archive with current-guidance labeling)
 * 8. Retain into Hindsight persistent storage
 * 9. Return sanitized confirmation record
 */
export async function teachMemory(input: unknown): Promise<TeachMemoryResult> {
  // 1-3. Validate payload, secret detection & command injection boundaries
  const validation = validateTeachMemoryRequest(input);
  if (!validation.valid) {
    return {
      success: false,
      message: validation.error,
      action: "rejected",
      error: validation.error,
      code: validation.code,
    };
  }

  const { data } = validation;

  // 4. Verify Hindsight connection
  const status = await getMemoryStatus();
  if (!status.connected) {
    return {
      success: false,
      message: "Hindsight persistent memory is temporarily unavailable.",
      action: "rejected",
      error: "Hindsight memory service is disconnected.",
      code: "MEMORY_SERVICE_UNAVAILABLE",
    };
  }

  const client = getHindsightClient();
  if (!client) {
    return {
      success: false,
      message: "Hindsight client instance could not be initialized.",
      action: "rejected",
      error: "Hindsight client unavailable.",
      code: "MEMORY_SERVICE_UNAVAILABLE",
    };
  }

  // 5. Normalize content
  const normalizedContent = normalizeTeachContent(data.content);
  if (normalizedContent.length === 0) {
    return {
      success: false,
      message: "Memory content cannot be empty after normalization.",
      action: "rejected",
      error: "Empty content.",
      code: "INVALID_MEMORY_PAYLOAD",
    };
  }

  // 6. Deduplication check
  const duplicateCheck = await checkDuplicateMemory(normalizedContent);
  if (duplicateCheck.isDuplicate && duplicateCheck.existingMemory) {
    const existing = duplicateCheck.existingMemory;
    return {
      success: true,
      message: "This strategic preference is already retained in persistent memory.",
      action: "deduplicated",
      memory: {
        id: existing.id,
        content: existing.text,
        category: data.category,
        context: existing.context || normalizeTeachContext(data.context, data.category, data.source),
        source: (existing.metadata?.source as import("./types").TeachMemorySource) || "seeded",
        timestamp: new Date().toISOString(),
      },
    };
  }

  // 7. Conflict detection
  const conflictCheck = await detectMemoryConflict(normalizedContent, data.category);

  // Derive contextual label
  let derivedContext = normalizeTeachContext(data.context, data.category, data.source);
  let warning: string | undefined;

  if (conflictCheck.hasConflict) {
    derivedContext = conflictCheck.suggestedContext || `Current Strategic Preference (${data.category})`;
    warning = conflictCheck.explanation;
  }

  // 8. Retain into Hindsight persistent storage
  const taughtTimestamp = new Date().toISOString();
  const metadata: Record<string, string> = {
    category: data.category.toLowerCase(),
    source: data.source || "user_taught",
    taughtAt: taughtTimestamp,
  };

  if (conflictCheck.hasConflict) {
    metadata.preferenceType = "current_guidance";
    metadata.historicalPreserved = "true";
  }

  try {
    await client.retain(HINDSIGHT_CONFIG.bankId, normalizedContent, {
      context: derivedContext,
      metadata,
    });

    const generatedId = `taught-${Date.now().toString(36)}`;

    return {
      success: true,
      message: conflictCheck.hasConflict
        ? "Strategic preference retained as current guidance while preserving historical records."
        : "Strategic preference retained successfully in persistent brand memory.",
      action: conflictCheck.hasConflict ? "conflict_noted" : "retained",
      memory: {
        id: generatedId,
        content: normalizedContent,
        category: data.category,
        context: derivedContext,
        source: data.source,
        timestamp: taughtTimestamp,
      },
      warning,
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Retention failed";
    console.error("[Teach Service] Failed to retain memory in Hindsight:", errorMsg);

    return {
      success: false,
      message: "Failed to persist memory to Hindsight Cloud.",
      action: "rejected",
      error: errorMsg,
      code: "HINDSIGHT_RETAIN_FAILED",
    };
  }
}
