import { getAIClient } from "./client";
import { getAIConfig, isAIConfigured } from "./config";
import { AIServiceError, normalizeAIError } from "./errors";
import { GenerateTextOptions, GenerateTextResult, MAX_PROMPT_LENGTH } from "./types";

/**
 * Core text generation service.
 * Accepts user prompt and optional system instructions, invoking the configured
 * upstream LLM provider and returning a normalized response.
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

  const client = getAIClient();
  if (!client) {
    throw new AIServiceError(
      "AI client could not be initialized.",
      "AI_SERVICE_UNAVAILABLE",
      503
    );
  }

  const config = getAIConfig();

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

  // 4. Invoke LLM provider
  try {
    console.log(`[AIService] Generating with model="${config.model}", baseUrl="${config.baseUrl || "https://api.openai.com/v1"}"`);
    const completion = await client.chat.completions.create({
      model: config.model,
      messages,
      temperature: typeof options.temperature === "number" ? options.temperature : 0.7,
      max_tokens: options.maxTokens,
    }, {
      timeout: options.timeoutMs || config.timeoutMs,
    });

    const generatedText = completion.choices[0]?.message?.content || "";
    const resolvedModel = completion.model || config.model;

    // Only include usage if actually returned by the provider
    let usage = undefined;
    if (completion.usage) {
      usage = {
        inputTokens: completion.usage.prompt_tokens,
        outputTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      };
    }

    return {
      text: generatedText,
      model: resolvedModel,
      usage,
    };
  } catch (error) {
    throw normalizeAIError(error);
  }
}
