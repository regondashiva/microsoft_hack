import { AIErrorCode } from "./types";

/**
 * Standardized application-level error for AI service operations.
 * Protects against leaking raw provider traces or API keys to clients.
 */
export class AIServiceError extends Error {
  public readonly code: AIErrorCode;
  public readonly statusCode: number;

  constructor(message: string, code: AIErrorCode, statusCode = 500) {
    super(message);
    this.name = "AIServiceError";
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AIServiceError.prototype);
  }
}

/**
 * Normalizes any caught provider error into a safe, client-friendly AIServiceError.
 * Logs diagnostics server-side while redacting any sensitive data.
 */
export function normalizeAIError(error: unknown): AIServiceError {
  if (error instanceof AIServiceError) {
    return error;
  }

  // Handle standard Abort / Timeout errors
  if (
    error instanceof Error &&
    (error.name === "AbortError" ||
      error.name === "TimeoutError" ||
      error.message.toLowerCase().includes("timeout") ||
      error.message.toLowerCase().includes("aborted"))
  ) {
    return new AIServiceError(
      "The AI service request timed out. Please try again.",
      "AI_TIMEOUT_ERROR",
      504
    );
  }

  // Handle provider HTTP status errors (e.g. OpenAI API errors)
  const status =
    (error as { status?: number })?.status ||
    (error as { statusCode?: number })?.statusCode;

  if (status === 401 || status === 403) {
    console.error("[AIService] Authentication failure with upstream provider.");
    return new AIServiceError(
      "Invalid or unauthorized AI provider credentials.",
      "AI_CONFIGURATION_ERROR",
      401
    );
  }

  if (status === 429) {
    console.error("[AIService] Rate limit exceeded by upstream provider.");
    return new AIServiceError(
      "AI provider rate limit reached. Please wait a moment before trying again.",
      "AI_RATE_LIMITED",
      429
    );
  }

  if (status === 500 || status === 502 || status === 503) {
    console.error(`[AIService] Upstream provider returned status ${status}.`);
    return new AIServiceError(
      "AI service provider is currently unavailable. Please try again later.",
      "AI_SERVICE_UNAVAILABLE",
      503
    );
  }

  const rawMessage = error instanceof Error ? error.message : "Unknown error";
  console.error("[AIService] Request failed:", rawMessage);

  return new AIServiceError(
    rawMessage || "Failed to complete AI request.",
    "AI_REQUEST_FAILED",
    500
  );
}
