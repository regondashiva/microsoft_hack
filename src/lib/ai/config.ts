import { AIConfig, AIProvider } from "./types";

if (typeof window !== "undefined") {
  throw new Error("CRITICAL SECURITY ERROR: AI configuration must only be accessed server-side.");
}

const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_TIMEOUT_MS = 30000;

function cleanEnv(val: string | undefined): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").trim();
}

function normalizeBaseUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  let url = cleanEnv(raw).replace(/\/+$/, "");
  if (!url) return undefined;

  // Specific normalizer for OpenRouter endpoints
  if (url.includes("openrouter.ai")) {
    if (url.endsWith("/chat/completions")) {
      url = url.slice(0, -"/chat/completions".length).replace(/\/+$/, "");
    }
    if (!url.endsWith("/v1")) {
      if (url.endsWith("/api")) {
        url = `${url}/v1`;
      } else {
        url = `${url}/api/v1`;
      }
    }
    return url;
  }

  return url;
}

/**
 * Returns safe server-side AI configuration without exposing API keys.
 */
export function getAIConfig(): AIConfig {
  const apiKey = cleanEnv(process.env.LLM_API_KEY || process.env.OPENAI_API_KEY);
  const isOpenRouter = apiKey.startsWith("sk-or-v1-");
  const provider = (cleanEnv(process.env.LLM_PROVIDER) as AIProvider) || (isOpenRouter ? "openai-compatible" : "openai");
  
  let baseUrl = normalizeBaseUrl(process.env.LLM_BASE_URL);
  if (isOpenRouter && (!baseUrl || !baseUrl.includes("openrouter.ai"))) {
    baseUrl = "https://openrouter.ai/api/v1";
  }

  let model = cleanEnv(process.env.LLM_MODEL || process.env.DEFAULT_MODEL);
  if (isOpenRouter) {
    if (!model || model === "gpt-4o-mini") {
      model = "openai/gpt-4o-mini";
    }
  } else {
    if (!model) {
      model = DEFAULT_MODEL;
    }
  }

  const rawTimeout = process.env.LLM_TIMEOUT_MS ? parseInt(process.env.LLM_TIMEOUT_MS, 10) : NaN;
  const timeoutMs = Number.isFinite(rawTimeout) && rawTimeout > 0 ? rawTimeout : DEFAULT_TIMEOUT_MS;

  return {
    provider,
    model,
    baseUrl,
    timeoutMs,
    configured: Boolean(apiKey && apiKey.length > 0),
  };
}

/**
 * Internal server-only credentials accessor.
 * Never export or expose outside server-side client initialization.
 */
export function getAIServerCredentials(): { apiKey: string; baseUrl?: string } {
  const apiKey = cleanEnv(process.env.LLM_API_KEY || process.env.OPENAI_API_KEY);
  const isOpenRouter = apiKey.startsWith("sk-or-v1-");
  let baseUrl = normalizeBaseUrl(process.env.LLM_BASE_URL);
  
  if (isOpenRouter && (!baseUrl || !baseUrl.includes("openrouter.ai"))) {
    baseUrl = "https://openrouter.ai/api/v1";
  }

  return {
    apiKey,
    baseUrl,
  };
}

/**
 * Convenience helper to determine whether the AI service is ready to handle requests.
 */
export function isAIConfigured(): boolean {
  return getAIConfig().configured;
}
