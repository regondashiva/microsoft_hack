import { z } from "zod";

/**
 * Maximum character limit for user-taught memory content.
 * Prevents prompt bloating and unbounded memory payloads.
 */
export const MAX_MEMORY_CONTENT_LENGTH = 600;

/**
 * Minimum character limit to prevent empty or trivial entries.
 */
export const MIN_MEMORY_CONTENT_LENGTH = 5;

/**
 * Strategic categories supported for persistent memory.
 */
export type TeachMemoryCategory = "BRAND" | "AUDIENCE" | "CONTENT" | "CAMPAIGN" | "STRATEGIC";

/**
 * Sources for persistent memories in Northstar bank.
 */
export type TeachMemorySource = "user_taught" | "user_feedback" | "seeded" | "campaign_history";

/**
 * Input payload schema for teaching a memory.
 */
export const teachMemoryRequestSchema = z.object({
  content: z
    .string()
    .min(MIN_MEMORY_CONTENT_LENGTH, `Memory content must be at least ${MIN_MEMORY_CONTENT_LENGTH} characters.`)
    .max(MAX_MEMORY_CONTENT_LENGTH, `Memory content must not exceed ${MAX_MEMORY_CONTENT_LENGTH} characters.`),
  category: z.enum(["BRAND", "AUDIENCE", "CONTENT", "CAMPAIGN", "STRATEGIC"], {
    message: "Category must be one of: BRAND, AUDIENCE, CONTENT, CAMPAIGN, STRATEGIC.",
  }),
  context: z
    .string()
    .max(120, "Context label must not exceed 120 characters.")
    .optional(),
  source: z.enum(["user_taught", "user_feedback"]).default("user_taught"),
});

export type TeachMemoryInput = z.infer<typeof teachMemoryRequestSchema>;

/**
 * Memory record representation returned after retention.
 */
export interface PersistedMemoryRecord {
  id: string;
  content: string;
  category: TeachMemoryCategory;
  context: string;
  source: TeachMemorySource;
  timestamp: string;
}

/**
 * Result returned by the teachMemory service.
 */
export interface TeachMemoryResult {
  success: boolean;
  message: string;
  action: "retained" | "deduplicated" | "conflict_noted" | "rejected";
  memory?: PersistedMemoryRecord;
  warning?: string;
  error?: string;
  code?: string;
}

/**
 * Conflict detection assessment.
 */
export interface ConflictDetectionResult {
  hasConflict: boolean;
  conflictingMemories: Array<{
    id: string;
    text: string;
    context?: string;
  }>;
  explanation?: string;
  suggestedContext?: string;
}
