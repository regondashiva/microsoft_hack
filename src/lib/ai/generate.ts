import { getAIConfig, getAIServerCredentials, isAIConfigured } from "./config";
import { AIServiceError, normalizeAIError } from "./errors";
import { GenerateTextOptions, GenerateTextResult, MAX_PROMPT_LENGTH } from "./types";

/**
 * Core text generation service using direct native fetch.
 * Guarantees zero SDK-wrapper caching issues across serverless environments.
 */
export async function generateText(options: GenerateTextOptions): Promise<GenerateTextResult> {
  const prompt = options.prompt?.trim();

  // 1. Validate prompt
  if (!prompt) {
    throw new AIServiceError(
      "Prompt is required and must not be empty.",
      "AI_INVALID_REQUEST",
      400
    );
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    throw new AIServiceError(
      `Prompt exceeds maximum allowed length of ${MAX_PROMPT_LENGTH} characters.`,
      "AI_INVALID_REQUEST",
      400
    );
  }

  // 2. Validate service readiness
  if (!isAIConfigured()) {
    throw new AIServiceError(
      "AI service is unconfigured. Please provide LLM_API_KEY in the server environment.",
      "AI_CONFIGURATION_ERROR",
      503
    );
  }

  const credentials = getAIServerCredentials();
  const config = getAIConfig();

  const baseUrl = (credentials.baseUrl || config.baseUrl || "https://openrouter.ai/api/v1").replace(/\/+$/, "");
  const endpoint = baseUrl.endsWith("/chat/completions") ? baseUrl : `${baseUrl}/chat/completions`;

  // 3. Prepare messages
  const messages: Array<{ role: "system" | "user"; content: string }> = [];

  if (options.system && options.system.trim()) {
    messages.push({
      role: "system",
      content: options.system.trim(),
    });
  }

  messages.push({
    role: "user",
    content: prompt,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || config.timeoutMs);

  // 4. Invoke LLM provider via direct HTTP fetch
  try {
    console.log(`[AIService] POST ${endpoint} (model: ${config.model})`);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.apiKey}`,
        "HTTP-Referer": "https://microsofthack.vercel.app",
        "X-Title": "MemoryAI Content Strategist",
      },
      body: JSON.stringify({
        model: config.model || "openai/gpt-4o-mini",
        messages,
        temperature: typeof options.temperature === "number" ? options.temperature : 0.7,
        max_tokens: options.maxTokens,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`[AIService] Upstream HTTP ${res.status}:`, errorBody);

      // Automatic fallback to openai/gpt-4o-mini on OpenRouter if custom model slug failed
      if (res.status === 404 && config.model !== "openai/gpt-4o-mini") {
        console.warn(`[AIService] Model "${config.model}" returned 404. Falling back to "openai/gpt-4o-mini"...`);
        const fallbackRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${credentials.apiKey}`,
            "HTTP-Referer": "https://microsofthack.vercel.app",
            "X-Title": "MemoryAI Content Strategist",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages,
            temperature: typeof options.temperature === "number" ? options.temperature : 0.7,
            max_tokens: options.maxTokens,
          }),
        });

        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          const generatedText = fallbackData.choices?.[0]?.message?.content || "";
          return {
            text: generatedText,
            model: fallbackData.model || "openai/gpt-4o-mini",
            usage: fallbackData.usage
              ? {
                  inputTokens: fallbackData.usage.prompt_tokens,
                  outputTokens: fallbackData.usage.completion_tokens,
                  totalTokens: fallbackData.usage.total_tokens,
                }
              : undefined,
          };
        }
      }

      throw new AIServiceError(
        `AI provider returned error (${res.status}): ${res.statusText}`,
        res.status === 401 || res.status === 403
          ? "AI_CONFIGURATION_ERROR"
          : res.status === 429
          ? "AI_RATE_LIMITED"
          : "AI_REQUEST_FAILED",
        res.status
      );
    }

    const data = await res.json();
    const generatedText = data.choices?.[0]?.message?.content || "";
    const resolvedModel = data.model || config.model;

    return {
      text: generatedText,
      model: resolvedModel,
      usage: data.usage
        ? {
            inputTokens: data.usage.prompt_tokens,
            outputTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw normalizeAIError(error);
  }
}
