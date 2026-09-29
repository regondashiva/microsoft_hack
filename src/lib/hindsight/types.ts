/**
 * Types for the Hindsight persistent memory layer.
 * All client-facing interfaces are sanitized to never expose API keys, internal tokens, or raw traces.
 */

export type ConnectionStatus = "connected" | "connecting" | "disconnected" | "error";

export interface MemoryStatusResponse {
  connected: boolean;
  status: ConnectionStatus;
  bankId: string;
  bankName: string;
  totalMemories?: number;
  message: string;
  initialized?: boolean;
}

export interface SafeMemoryResult {
  id: string;
  text: string;
  type?: string;
  category?: string;
  context?: string;
  score?: number;
  metadata?: Record<string, string>;
}

export interface RecallResponsePayload {
  query: string;
  results: SafeMemoryResult[];
  count: number;
  bankId: string;
  timestamp: string;
}

export interface RecallRequestPayload {
  query: string;
  limit?: number;
}

export interface SeedMemoryItem {
  id: string;
  category: "brand_identity" | "target_audience" | "brand_positioning" | "brand_voice" | "content_preference" | "content_themes" | "audience_segment" | "secondary_audience" | "campaign_history";
  content: string;
  context: string;
}
