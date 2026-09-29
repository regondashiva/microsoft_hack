/**
 * Safe, centralized application environment configuration.
 * Future service secrets (LLM, Hindsight) are strictly typed as optional in Task 1.
 */

export const env = {
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "MemoryAI",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0",
  debug: process.env.DEBUG_MODE === "true",

  // Service readiness flags (Accurately reporting Task 1 state)
  features: {
    hindsightConnected: Boolean(process.env.HINDSIGHT_API_KEY),
    llmConnected: Boolean(
      process.env.LLM_API_KEY ||
      process.env.OPENAI_API_KEY
    ),
  },
} as const;
