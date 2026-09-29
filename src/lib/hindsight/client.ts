import { HindsightClient } from "@vectorize-io/hindsight-client";
import { HINDSIGHT_CONFIG, isHindsightConfigured } from "./config";

if (typeof window !== "undefined") {
  throw new Error("CRITICAL SECURITY ERROR: HindsightClient must only be instantiated server-side.");
}

let clientInstance: HindsightClient | null = null;
let lastApiKey = "";
let lastBaseUrl = "";

/**
 * Returns the singleton HindsightClient instance, or null if not configured.
 */
export function getHindsightClient(): HindsightClient | null {
  if (!isHindsightConfigured()) {
    return null;
  }

  const currentApiKey = HINDSIGHT_CONFIG.apiKey;
  const currentBaseUrl = HINDSIGHT_CONFIG.baseUrl;

  if (!clientInstance || lastApiKey !== currentApiKey || lastBaseUrl !== currentBaseUrl) {
    clientInstance = new HindsightClient({
      baseUrl: currentBaseUrl,
      apiKey: currentApiKey,
    });
    lastApiKey = currentApiKey;
    lastBaseUrl = currentBaseUrl;
  }

  return clientInstance;
}
