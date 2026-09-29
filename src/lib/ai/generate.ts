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
    const modelsToTry = [
      config.model,
      "google/gemini-2.0-flash-exp:free",
      "meta-llama/llama-3.2-3b-instruct:free",
      "meta-llama/llama-3.1-8b-instruct:free",
      "mistralai/mistral-7b-instruct:free",
      "qwen/qwen-2.5-72b-instruct:free",
      "openai/gpt-4o-mini",
    ].filter((m, i, arr): m is string => Boolean(m) && arr.indexOf(m) === i);

    let lastErrorStatus = 500;
    let lastErrorText = "";

    for (const modelToAttempt of modelsToTry) {
      try {
        console.log(`[AIService] POST ${endpoint} (attempting model: ${modelToAttempt})`);

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${credentials.apiKey}`,
            "HTTP-Referer": "https://microsofthack.vercel.app",
            "X-Title": "MemoryAI Content Strategist",
          },
          body: JSON.stringify({
            model: modelToAttempt,
            messages,
            temperature: typeof options.temperature === "number" ? options.temperature : 0.7,
            max_tokens: options.maxTokens,
          }),
          signal: controller.signal,
        });

        if (res.ok) {
          clearTimeout(timeoutId);
          const data = await res.json();
          const generatedText = data.choices?.[0]?.message?.content || "";
          const resolvedModel = data.model || modelToAttempt;

          if (generatedText && generatedText.trim().length > 0) {
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
          }
        } else {
          lastErrorStatus = res.status;
          lastErrorText = await res.text();
          console.warn(`[AIService] Model ${modelToAttempt} failed with status ${res.status}:`, lastErrorText.slice(0, 150));
          // Continue to try next fallback model in the list
          continue;
        }
      } catch (attemptErr: unknown) {
        if (attemptErr instanceof Error && attemptErr.name === "AbortError") {
          throw new AIServiceError("AI request timed out.", "AI_TIMEOUT_ERROR", 408);
        }
        console.warn(`[AIService] Attempt with ${modelToAttempt} threw:`, attemptErr);
        continue;
      }
    }

    clearTimeout(timeoutId);
    throw new AIServiceError(
      `AI provider returned error (${lastErrorStatus}): ${lastErrorText || "Upstream request failed"}`,
      lastErrorStatus === 401 || lastErrorStatus === 403
        ? "AI_CONFIGURATION_ERROR"
        : lastErrorStatus === 429
        ? "AI_RATE_LIMITED"
        : "AI_REQUEST_FAILED",
      lastErrorStatus
    );
  } catch (error) {
    clearTimeout(timeoutId);
    throw normalizeAIError(error);
  }
}
