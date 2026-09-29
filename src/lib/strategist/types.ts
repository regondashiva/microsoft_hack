import { z } from "zod";

/**
 * Maximum number of memories included in the bounded strategist context.
 * Bounding prevents prompt bloating, lowers token usage, and focuses LLM reasoning.
 */
export const MAX_CONTEXT_MEMORIES = 6;

/**
 * Standard strategic memory categories for Northstar Brand Co.
 */
export type MemoryCategory = "BRAND" | "AUDIENCE" | "CONTENT" | "CAMPAIGN" | "STRATEGIC";

/**
 * Normalized memory retrieved from Hindsight persistent storage.
 */
export interface RetrievedMemory {
  id: string;
  text: string;
  type?: string;
  category?: string;
  context?: string;
  score?: number;
  metadata?: Record<string, string>;
  source?: string;
}

/**
 * Memory assigned to a strategic category with an authentic user-facing citation label.
 */
export interface CategorizedMemory extends RetrievedMemory {
  memoryCategory: MemoryCategory;
  citationLabel: string;
}

/**
 * Memory selected for inclusion in the final LLM prompt context.
 */
export interface SelectedMemory extends CategorizedMemory {
  priority: number;
  selectionReason: string;
}

/**
 * Memory excluded from the final LLM prompt context (e.g. channel mismatch, lower priority, duplicate).
 */
export interface ExcludedMemory extends RetrievedMemory {
  memoryCategory?: MemoryCategory;
  reason: string;
}

/**
 * Query analysis details derived deterministically from the user's input.
 */
export interface QueryIntent {
  rawQuery: string;
  normalizedQuery: string;
  targetCategories: MemoryCategory[];
  channel?: "linkedin" | "instagram" | "all";
  audienceTarget?: "young_professionals" | "small_business" | "general";
  isVoiceOrToneQuery: boolean;
  isCampaignQuery: boolean;
  isAudienceQuery: boolean;
  isContentIdeaQuery: boolean;
  isUnrelatedOrFinancialQuery: boolean;
  keywords: string[];
}

/**
 * Structured memory context grouped by category and formatted for prompt delivery.
 */
export interface MemoryContext {
  categorized: Record<MemoryCategory, SelectedMemory[]>;
  allSelected: SelectedMemory[];
  formattedPromptContext: string;
  totalSelected: number;
}

/**
 * Complete result of the retrieval and contextual filtering pipeline.
 */
export interface RetrievalResult {
  retrievedMemories: RetrievedMemory[];
  selectedMemories: SelectedMemory[];
  excludedMemories: ExcludedMemory[];
  queryIntent: QueryIntent;
  context: MemoryContext;
  retrievedCount: number;
  selectedCount: number;
  excludedCount: number;
  categoriesRepresented: MemoryCategory[];
}

/**
 * Strict Zod validation schema for the AI Content Strategist response.
 * Ensures the LLM output conforms to structured expectations before reaching the UI.
 */
export const strategyRecommendationSchema = z.object({
  title: z.string().min(1, "Recommendation title is required"),
  description: z.string().min(1, "Recommendation description is required"),
});

export const strategyResponseSchema = z.object({
  summary: z.string().min(1, "Strategy summary is required"),
  recommendations: z
    .array(strategyRecommendationSchema)
    .min(1, "At least one strategic recommendation is required")
    .max(6, "Maximum 6 recommendations permitted"),
  reasoning: z.string().min(1, "Strategic reasoning is required"),
  memoryUsed: z.array(z.string()).default([]),
  caveats: z.array(z.string()).default([]),
});

export type StrategyRecommendation = z.infer<typeof strategyRecommendationSchema>;
export type StrategyResponse = z.infer<typeof strategyResponseSchema>;

export interface StrategistApiRequest {
  query: string;
}

export interface FormulateStrategyResult {
  success: boolean;
  strategy?: StrategyResponse;
  error?: string;
  code?: string;
  retrievedMemoryCount: number;
  selectedMemoryCount?: number;
}

export interface StrategistApiResponse {
  success: boolean;
  strategy?: StrategyResponse;
  error?: string;
  code?: string;
  query?: string;
  retrievedMemoryCount?: number;
  selectedMemoryCount?: number;
}
