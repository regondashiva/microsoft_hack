import { z } from "zod";

/**
 * Standard authentic provenance sources for Northstar brand memories.
 */
export type ProvenanceSource = "user_taught" | "user_feedback" | "campaign_history" | "seeded";

/**
 * Normalized user-facing label for memory provenance.
 */
export type ProvenanceLabel =
  | "User Taught"
  | "User Feedback"
  | "Campaign History"
  | "Seeded Brand Knowledge";

/**
 * Factual memory evidence item selected from Hindsight persistent memory.
 * Controlled strictly by application logic (not LLM hallucination).
 */
export const memoryEvidenceItemSchema = z.object({
  id: z.string(),
  category: z.string(),
  citationLabel: z.string(),
  source: z.enum(["user_taught", "user_feedback", "campaign_history", "seeded"]),
  sourceLabel: z.enum([
    "User Taught",
    "User Feedback",
    "Campaign History",
    "Seeded Brand Knowledge",
  ]),
  content: z.string(),
  context: z.string().optional(),
});

export type MemoryEvidenceItem = z.infer<typeof memoryEvidenceItemSchema>;

/**
 * Factual campaign evidence item selected from historical campaign records.
 * Always carries the explicit synthetic demo data disclaimer.
 */
export const campaignEvidenceItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  channel: z.string(),
  status: z.string(),
  contentTheme: z.string(),
  format: z.string(),
  keyTakeaway: z.string(),
  impressions: z.number(),
  reach: z.number(),
  engagementRate: z.number(),
  clickThroughRate: z.number(),
  signals: z.array(z.string()),
  isSynthetic: z.literal(true),
  disclaimer: z.string(),
});

export type CampaignEvidenceItem = z.infer<typeof campaignEvidenceItemSchema>;

/**
 * Explains why a specific recommendation fits Northstar and links it to
 * supporting memory and campaign evidence.
 */
export const recommendationExplanationSchema = z.object({
  recommendationTitle: z.string(),
  whyFits: z.string(),
  supportingMemories: z.array(z.string()),
  supportingCampaigns: z.array(z.string()),
  strategicConnection: z.string(),
});

export type RecommendationExplanation = z.infer<typeof recommendationExplanationSchema>;

/**
 * Step in the restrained visual evidence chain:
 * Memory → Campaign Evidence → Strategic Reasoning → Recommendation
 */
export const visualEvidenceStepSchema = z.object({
  step: z.enum(["memory", "campaign", "reasoning", "recommendation"]),
  badge: z.string(),
  title: z.string(),
  detail: z.string(),
});

export type VisualEvidenceStep = z.infer<typeof visualEvidenceStepSchema>;

/**
 * Complete explainability package for a formulated content strategy.
 * Separates verified facts (application-controlled) from strategic reasoning.
 */
export const strategyExplanationSchema = z.object({
  hasEvidence: z.boolean(),
  evidenceCounts: z.object({
    memories: z.number(),
    campaigns: z.number(),
    label: z.string(),
  }),
  memoryEvidence: z.array(memoryEvidenceItemSchema),
  campaignEvidence: z.array(campaignEvidenceItemSchema),
  strategicConnection: z.string(),
  visualFlow: z.array(visualEvidenceStepSchema),
  recommendationExplanations: z.array(recommendationExplanationSchema),
  missingEvidence: z.object({
    hasMissingMemory: z.boolean(),
    memoryNote: z.string().optional(),
    hasMissingCampaign: z.boolean(),
    campaignNote: z.string().optional(),
  }),
});

export type StrategyExplanation = z.infer<typeof strategyExplanationSchema>;
