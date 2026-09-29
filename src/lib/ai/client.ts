import OpenAI from "openai";
import { getAIConfig, getAIServerCredentials } from "./config";

if (typeof window !== "undefined") {
  throw new Error("CRITICAL SECURITY ERROR: AI client must only be instantiated server-side.");
}

/**
 * Returns a server-side OpenAI client configured dynamically from environment variables.
 */
export function getAIClient(): OpenAI | null {
  const credentials = getAIServerCredentials();
  if (!credentials.apiKey) {
    return null;
  }

  const config = getAIConfig();

  return new OpenAI({
    apiKey: credentials.apiKey,
    baseURL: credentials.baseUrl,
    timeout: config.timeoutMs,
    maxRetries: 2,
    defaultHeaders: {
      "HTTP-Referer": "https://microsofthack.vercel.app",
      "X-Title": "MemoryAI Content Strategist",
    },
  });
}
