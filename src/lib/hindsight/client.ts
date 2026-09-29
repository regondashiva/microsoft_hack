import { HindsightClient } from "@vectorize-io/hindsight-client";
import { HINDSIGHT_CONFIG, isHindsightConfigured } from "./config";

if (typeof window !== "undefined") {
  throw new Error("CRITICAL SECURITY ERROR: HindsightClient must only be instantiated server-side.");
}

let clientInstance: HindsightClient | null = null;

/**
 * Returns the singleton HindsightClient instance, or null if not configured.
 */
export function getHindsightClient(): HindsightClient | null {
  if (!isHindsightConfigured()) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = new HindsightClient({
      baseUrl: HINDSIGHT_CONFIG.baseUrl,
      apiKey: HINDSIGHT_CONFIG.apiKey,
    });
  }

  return clientInstance;
}
