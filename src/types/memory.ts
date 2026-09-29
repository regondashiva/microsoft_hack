/**
 * Memory contract for the persistent knowledge layer (Hindsight integration in future tasks).
 */

export type MemoryType = 
  | "brand_fact"
  | "voice_rule"
  | "campaign_outcome"
  | "audience_signal"
  | "feedback_loop"
  | "strategic_heuristic";

export interface MemoryNode {
  id: string;
  brandId: string;
  type: MemoryType;
  key: string;
  statement: string;
  confidence: number; // 0.0 - 1.0
  source: string;
  verifiedByUser: boolean;
  recallCount: number;
  lastRecalledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryQuery {
  brandId: string;
  intent: string;
  types?: MemoryType[];
  threshold?: number;
  limit?: number;
}
