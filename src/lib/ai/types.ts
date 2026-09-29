/**
 * Strict TypeScript types for the application AI service layer.
 * All types are server-safe and isolated from provider-specific dependencies.
 */

export const MAX_PROMPT_LENGTH = 4000;

export type AIProvider = "openai" | "openai-compatible" | "custom";

export type AIErrorCode =
  | "AI_SERVICE_UNAVAILABLE"
  | "AI_CONFIGURATION_ERROR"
  | "AI_RATE_LIMITED"
  | "AI_REQUEST_FAILED"
  | "AI_TIMEOUT_ERROR"
  | "AI_INVALID_REQUEST";

export interface AIConfig {
  provider: AIProvider;
  model: string;
  baseUrl?: string;
  timeoutMs: number;
  configured: boolean;
}

export interface GenerateTextOptions {
  system?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface AIUsageMetrics {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

export interface GenerateTextResult {
  text: string;
  model: string;
  usage?: AIUsageMetrics;
}

export interface AIStatusResponse {
  configured: boolean;
  provider: string;
  model: string;
  message?: string;
}

export interface AITestRequestPayload {
  prompt: string;
}

export interface AITestResponsePayload {
  success: boolean;
  result?: GenerateTextResult;
  error?: string;
  code?: AIErrorCode;
}
