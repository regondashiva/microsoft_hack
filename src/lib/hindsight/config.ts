/**
 * Server-only configuration for the Hindsight persistent memory service.
 * NEVER import this file from client components or "use client" boundaries.
 */

if (typeof window !== "undefined") {
  throw new Error("CRITICAL SECURITY ERROR: Hindsight configuration must only be accessed server-side.");
}

function cleanEnv(val: string | undefined): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").trim();
}

export const HINDSIGHT_CONFIG = {
  get baseUrl() {
    return cleanEnv(process.env.HINDSIGHT_BASE_URL) || "https://api.hindsight.vectorize.io";
  },
  get apiKey() {
    return cleanEnv(process.env.HINDSIGHT_API_KEY);
  },
  get bankId() {
    return cleanEnv(process.env.HINDSIGHT_BANK_ID) || "northstar-content-strategist";
  },
  bankName: "Northstar Content Strategist",
  bankMission:
    "This memory bank stores persistent strategic knowledge for Northstar Brand Co.'s AI Content Strategist. It contains brand context, audience preferences, campaign history, content preferences, feedback and strategic insights that can improve future content strategy.",
};

/**
 * Returns true if the Hindsight API key is present and configured.
 */
export function isHindsightConfigured(): boolean {
  return Boolean(HINDSIGHT_CONFIG.apiKey && HINDSIGHT_CONFIG.apiKey.length > 0);
}
