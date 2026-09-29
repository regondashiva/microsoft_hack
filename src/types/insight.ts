/**
 * Content insights and observed performance patterns.
 */

export type InsightCategory = 
  | "performance"
  | "audience_feedback"
  | "messaging_resonance"
  | "competitive_shift";

export interface ContentInsight {
  id: string;
  brandId: string;
  category: InsightCategory;
  title: string;
  summary: string;
  evidence: string;
  confidence: number; // 0.0 - 1.0
  sourceCampaignId?: string;
  observedAt: string;
}
