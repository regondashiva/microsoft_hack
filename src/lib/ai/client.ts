import OpenAI from "openai";
import { getAIConfig, getAIServerCredentials } from "./config";

if (typeof window !== "undefined") {
  throw new Error("CRITICAL SECURITY ERROR: AI client must only be instantiated server-side.");
}

let clientInstance: OpenAI | null = null;
let lastApiKey = "";
let lastBaseUrl: string | undefined = undefined;

/**
 * Returns a singleton OpenAI client configured from server-side environment variables.
 * Automatically refreshes if environment credentials change.
 */
export function getAIClient(): OpenAI | null {
  const credentials = getAIServerCredentials();
  if (!credentials.apiKey) {
    return null;
  }

  const config = getAIConfig();

  // If credentials or baseUrl have changed, recreate the instance
  if (!clientInstance || lastApiKey !== credentials.apiKey || lastBaseUrl !== credentials.baseUrl) {
    clientInstance = new OpenAI({
      apiKey: credentials.apiKey,
      baseURL: credentials.baseUrl,
      timeout: config.timeoutMs,
      maxRetries: 2,
    });
    lastApiKey = credentials.apiKey;
    lastBaseUrl = credentials.baseUrl;
  }

  return clientInstance;
}
