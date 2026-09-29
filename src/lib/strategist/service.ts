import { getMemoryStatus } from "../hindsight/memory";
import { generateText } from "../ai/generate";
import { isAIConfigured } from "../ai/config";
import { buildStrategistSystemPrompt, buildStrategistUserPrompt } from "./prompt";
import {
  FormulateStrategyResult,
  MAX_CONTEXT_MEMORIES,
  MemoryCategory,
  SelectedMemory,
  strategyResponseSchema,
} from "./types";
import { retrieveMemoriesForQuery } from "./retrieval";
import { buildMemoryContext } from "./context";
import { selectRelevantCampaignContext } from "../campaigns/selection";
import { buildStrategyExplanation } from "./explainability";

/**
 * Strips markdown code blocks if the model wrapped its response in ```json ... ```.
 */
function cleanJsonOutput(raw: string): string {
  let cleaned = raw.trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  } else {
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3);
    }
  }
  return cleaned.trim();
}

/**
 * Derives user-facing memory citation labels strictly from the memories selected
 * for the final LLM prompt context. Never cites excluded or unselected memories.
 */
function deriveMemoryCitations(
  selectedMemories: SelectedMemory[],
  modelCitations: string[]
): string[] {
  if (selectedMemories.length === 0) {
    return [];
  }

  const validLabels = selectedMemories.map((m) => m.citationLabel);
  const normalizedValid = new Map<string, string>();
  for (const label of validLabels) {
    normalizedValid.set(label.toLowerCase(), label);
  }

  const verifiedCitations: string[] = [];
  if (Array.isArray(modelCitations)) {
    for (const citation of modelCitations) {
      if (typeof citation !== "string") continue;
      const lower = citation.trim().toLowerCase();
      // Match exact label or substring match with genuine selected memory labels
      const matched =
        normalizedValid.get(lower) ||
        validLabels.find(
          (l) => lower.includes(l.toLowerCase()) || l.toLowerCase().includes(lower)
        );

      if (matched && !verifiedCitations.includes(matched)) {
        verifiedCitations.push(matched);
      }
    }
  }

  // If the model produced verified citations referencing only selected memories, use them
  if (verifiedCitations.length > 0) {
    return verifiedCitations.slice(0, MAX_CONTEXT_MEMORIES);
  }

  // Otherwise, default strictly to citation labels of the selected memories
  return Array.from(new Set(validLabels)).slice(0, MAX_CONTEXT_MEMORIES);
}

/**
 * Formulates a grounded content strategy for a user query.
 *
 * Pipeline Architecture:
 * User Query
 *   ↓
 * Query Analysis
 *   ↓
 * Hindsight Recall
 *   ↓
 * Relevance Filtering
 *   ↓
 * Context Categorization
 *   ↓
 * Context Budgeting
 *   ↓
 * Strategist Prompt
 *   ↓
 * OpenRouter
 *   ↓
 * Zod Validation
 *   ↓
 * Strategy UI
 */
export async function formulateStrategy(query: string): Promise<FormulateStrategyResult> {
  const trimmedQuery = query?.trim();

  // 1. Validate query
  if (!trimmedQuery) {
    return {
      success: false,
      error: "Query is required to formulate strategy.",
      code: "STRATEGIST_INVALID_QUERY",
      retrievedMemoryCount: 0,
      selectedMemoryCount: 0,
    };
  }

  // 2. Check Hindsight connection
  const memoryStatus = await getMemoryStatus();
  if (!memoryStatus.connected) {
    console.error("[Strategist Service] Hindsight memory service is disconnected.");
    return {
      success: false,
      error: "Northstar memory is temporarily unavailable.",
      code: "MEMORY_SERVICE_UNAVAILABLE",
      retrievedMemoryCount: 0,
      selectedMemoryCount: 0,
    };
  }

  // 3. Retrieval layer: Recall, deduplicate, and filter
  let retrievedMemories = [];
  let candidateMemories = [];
  let excludedMemories = [];
  let queryIntent;

  try {
    const retrieval = await retrieveMemoriesForQuery(trimmedQuery);
    retrievedMemories = retrieval.retrievedMemories;
    candidateMemories = retrieval.candidateMemories;
    excludedMemories = retrieval.excludedMemories;
    queryIntent = retrieval.queryIntent;
  } catch (err) {
    console.error("[Strategist Service] Memory recall failure:", err);
    return {
      success: false,
      error: "Northstar memory is temporarily unavailable.",
      code: "MEMORY_SERVICE_UNAVAILABLE",
      retrievedMemoryCount: 0,
      selectedMemoryCount: 0,
    };
  }

  // 4. Handle empty memory (Insufficient context)
  if (retrievedMemories.length === 0 || candidateMemories.length === 0) {
    const fallbackRecs = [
      {
        title: "Provide Relevant Brand Context",
        description:
          "The persistent memory bank returned no relevant knowledge records for this query. The strategist requires verified Northstar brand context before formulating recommendations.",
      },
    ];
    const fallbackReasoning =
      "To prevent generic marketing filler or ungrounded claims, the AI Content Strategist operates exclusively over verified brand memory.";
    const fallbackSummary =
      "Not enough Northstar context is available to make a grounded recommendation.";

    const explanation = buildStrategyExplanation({
      query: trimmedQuery,
      summary: fallbackSummary,
      recommendations: fallbackRecs,
      reasoning: fallbackReasoning,
      memoryUsed: [],
      selectedMemories: [],
      selectedCampaigns: [],
      queryIntent,
    });

    return {
      success: true,
      strategy: {
        summary: fallbackSummary,
        recommendations: fallbackRecs,
        reasoning: fallbackReasoning,
        memoryUsed: [],
        caveats: [
          "Ensure your query relates to Northstar's brand identity, target audience (young professionals), content preferences, or campaign history.",
        ],
        explanation,
      },
      retrievedMemoryCount: retrievedMemories.length,
      selectedMemoryCount: 0,
    };
  }

  // 5. Context layer: Categorize, prioritize, and budget context
  const { context, selectedMemories, budgetExcludedMemories } = buildMemoryContext(
    candidateMemories,
    queryIntent,
    MAX_CONTEXT_MEMORIES
  );

  const totalExcludedCount = excludedMemories.length + budgetExcludedMemories.length;
  const categoriesUsed = (Object.keys(context.categorized) as MemoryCategory[]).filter(
    (c) => context.categorized[c].length > 0
  );

  // 6. Campaign context layer: Query-aware campaign performance retrieval
  const campaignContextResult = selectRelevantCampaignContext(trimmedQuery, queryIntent);

  // Safe server-side debug observability (no API keys, no credentials, no prompts)
  console.log(
    `[Strategist Service] Context summary: memories=${selectedMemories.length}, excluded=${totalExcludedCount}, categories=[${categoriesUsed.join(", ")}], campaigns=${campaignContextResult.hasContext ? campaignContextResult.selectedCampaigns.length : 0}`
  );

  // 7. Verify LLM service readiness
  if (!isAIConfigured()) {
    console.error("[Strategist Service] AI service is unconfigured.");
    return {
      success: false,
      error: "AI strategy is temporarily unavailable. Please configure LLM_API_KEY in the server environment.",
      code: "AI_SERVICE_UNAVAILABLE",
      retrievedMemoryCount: retrievedMemories.length,
      selectedMemoryCount: selectedMemories.length,
    };
  }

  // 8. Build structured prompt
  const systemPrompt = buildStrategistSystemPrompt();
  const userPrompt = buildStrategistUserPrompt(
    trimmedQuery,
    context.formattedPromptContext,
    campaignContextResult.hasContext ? campaignContextResult.formattedContext : undefined
  );

  // 8. Invoke LLM generation
  let rawGeneration = "";
  try {
    const aiResult = await generateText({
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.2, // Low temperature for deterministic, factual adherence
      maxTokens: 1500,
    });
    rawGeneration = aiResult.text;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    console.error("[Strategist Service] Generation failure:", message);
    return {
      success: false,
      error: "AI strategy is temporarily unavailable.",
      code: "AI_REQUEST_FAILED",
      retrievedMemoryCount: retrievedMemories.length,
      selectedMemoryCount: selectedMemories.length,
    };
  }

  // 9. Parse and validate JSON against strict Zod schema
  try {
    const cleanedJson = cleanJsonOutput(rawGeneration);
    const parsedObj = JSON.parse(cleanedJson);

    // Defensively ensure at least one recommendation exists for purely informational queries
    if (!Array.isArray(parsedObj.recommendations) || parsedObj.recommendations.length === 0) {
      parsedObj.recommendations = [
        {
          title: "Align with Verified Northstar Guidelines",
          description:
            "Ensure upcoming content and marketing initiatives adhere strictly to Northstar's verified brand voice and available memory context.",
        },
      ];
    }

    const validated = strategyResponseSchema.parse(parsedObj);

    // Ensure memoryUsed references strictly selected memory context
    const finalMemoryUsed = deriveMemoryCitations(selectedMemories, validated.memoryUsed);

    // Construct deterministic explainability data connecting memory, campaign evidence, and recommendations
    const explanation = buildStrategyExplanation({
      query: trimmedQuery,
      summary: validated.summary,
      recommendations: validated.recommendations,
      reasoning: validated.reasoning,
      memoryUsed: finalMemoryUsed,
      selectedMemories,
      selectedCampaigns: campaignContextResult.hasContext
        ? campaignContextResult.selectedCampaigns
        : [],
      queryIntent,
    });

    return {
      success: true,
      strategy: {
        ...validated,
        memoryUsed: finalMemoryUsed,
        explanation,
      },
      retrievedMemoryCount: retrievedMemories.length,
      selectedMemoryCount: selectedMemories.length,
    };
  } catch (parseError) {
    console.error("[Strategist Service] Output schema validation failure:", parseError);
    return {
      success: false,
      error: "Failed to parse structured strategic recommendation.",
      code: "AI_MALFORMED_RESPONSE",
      retrievedMemoryCount: retrievedMemories.length,
      selectedMemoryCount: selectedMemories.length,
    };
  }
}
