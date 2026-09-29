import {
  CategorizedMemory,
  ExcludedMemory,
  MAX_CONTEXT_MEMORIES,
  MemoryCategory,
  MemoryContext,
  QueryIntent,
  RetrievedMemory,
  SelectedMemory,
} from "./types";

/**
 * Assigns a retrieved memory to a strategic Northstar category and derives an authentic citation label.
 */
export function categorizeMemory(mem: RetrievedMemory): CategorizedMemory {
  const catKey = (mem.metadata?.category || mem.category || "").toLowerCase();
  const contextLower = (mem.context || "").toLowerCase();
  const textLower = mem.text.toLowerCase();

  let memoryCategory: MemoryCategory = "STRATEGIC";

  if (
    catKey === "brand" ||
    catKey === "brand_identity" ||
    catKey === "brand_positioning" ||
    catKey === "brand_voice" ||
    contextLower.includes("brand") ||
    contextLower.includes("positioning") ||
    contextLower.includes("voice") ||
    contextLower.includes("mission")
  ) {
    memoryCategory = "BRAND";
  } else if (
    catKey === "audience" ||
    catKey === "target_audience" ||
    catKey === "audience_segment" ||
    catKey === "secondary_audience" ||
    contextLower.includes("audience") ||
    contextLower.includes("demographics")
  ) {
    memoryCategory = "AUDIENCE";
  } else if (
    catKey === "content" ||
    catKey === "content_preference" ||
    catKey === "content_themes" ||
    contextLower.includes("content") ||
    contextLower.includes("editorial")
  ) {
    memoryCategory = "CONTENT";
  } else if (
    catKey === "campaign" ||
    catKey === "campaign_history" ||
    contextLower.includes("campaign") ||
    textLower.includes("campaign called")
  ) {
    memoryCategory = "CAMPAIGN";
  } else if (catKey === "strategic") {
    memoryCategory = "STRATEGIC";
  } else {
    // Content-based heuristic fallback
    if (textLower.includes("communication style") || textLower.includes("brand voice")) {
      memoryCategory = "BRAND";
    } else if (textLower.includes("young professional") || textLower.includes("audience")) {
      memoryCategory = "AUDIENCE";
    } else if (textLower.includes("content theme") || textLower.includes("educational content")) {
      memoryCategory = "CONTENT";
    } else if (textLower.includes("campaign")) {
      memoryCategory = "CAMPAIGN";
    }
  }

  // Derive human-readable citation label
  let citationLabel = mem.context?.trim();
  if (!citationLabel) {
    switch (memoryCategory) {
      case "BRAND":
        citationLabel = "Brand Identity & Voice";
        break;
      case "AUDIENCE":
        citationLabel = "Target Audience Strategy";
        break;
      case "CONTENT":
        citationLabel = "Content Strategy Principles";
        break;
      case "CAMPAIGN":
        citationLabel = "Campaign History";
        break;
      default:
        citationLabel = "Strategic Brand Context";
    }
  }

  return {
    ...mem,
    memoryCategory,
    citationLabel,
  };
}

/**
 * Calculates priority weight for a categorized memory based on query intent and metadata.
 * Uses real Hindsight scores when available; does not fabricate them.
 */
export function scoreMemoryPriority(
  mem: CategorizedMemory,
  intent: QueryIntent
): { priority: number; selectionReason: string } {
  let priority = 0;
  const reasons: string[] = [];

  // 1. Genuine Hindsight score contribution (if provided by API/SDK)
  if (typeof mem.score === "number") {
    priority += Math.round(mem.score * 50);
    reasons.push(`hindsight_score: ${mem.score.toFixed(3)}`);
  }

  // 2. Query target category priority
  const categoryRank = intent.targetCategories.indexOf(mem.memoryCategory);
  if (categoryRank === 0) {
    priority += 60;
    reasons.push(`primary_category: ${mem.memoryCategory}`);
  } else if (categoryRank === 1) {
    priority += 40;
    reasons.push(`secondary_category: ${mem.memoryCategory}`);
  } else if (categoryRank === 2) {
    priority += 25;
  } else if (categoryRank === 3) {
    priority += 15;
  } else {
    priority += 5;
  }

  const textLower = mem.text.toLowerCase();
  const contextLower = (mem.context || "").toLowerCase();

  // 3. Query intent-specific alignment boosts
  if (intent.isVoiceOrToneQuery && (mem.category === "brand_voice" || textLower.includes("communication style"))) {
    priority += 50;
    reasons.push("voice_guidelines_match");
  }

  if (intent.channel === "instagram" && (textLower.includes("instagram") || contextLower.includes("instagram"))) {
    priority += 50;
    reasons.push("instagram_channel_match");
  }

  if (intent.channel === "linkedin" && (textLower.includes("linkedin") || contextLower.includes("linkedin"))) {
    priority += 50;
    reasons.push("linkedin_channel_match");
  }

  if (
    intent.audienceTarget === "young_professionals" &&
    (textLower.includes("young professional") || contextLower.includes("demographics"))
  ) {
    priority += 45;
    reasons.push("young_professionals_audience_match");
  }

  if (
    intent.audienceTarget === "small_business" &&
    (textLower.includes("small business") || contextLower.includes("expansion"))
  ) {
    priority += 45;
    reasons.push("small_business_audience_match");
  }

  if (
    intent.isContentIdeaQuery &&
    (mem.category === "content_preference" || mem.category === "content_themes")
  ) {
    priority += 35;
    reasons.push("content_strategy_pillars_match");
  }

  // 4. Keyword overlap
  let matchedKeywords = 0;
  for (const kw of intent.keywords) {
    if (textLower.includes(kw) || contextLower.includes(kw)) {
      matchedKeywords++;
      priority += 10;
    }
  }
  if (matchedKeywords > 0) {
    reasons.push(`keyword_matches: ${matchedKeywords}`);
  }

  return {
    priority,
    selectionReason: reasons.join("; ") || "default_alignment",
  };
}

/**
 * Sanitizes untrusted memory text to prevent prompt injection or XML tag spoofing.
 */
function sanitizeMemoryText(text: string): string {
  return text
    .replace(/<\/?(northstar_memory|brand_context|audience_context|content_context|campaign_context|strategic_context|user_query)>/gi, "")
    .trim();
}

/**
 * Formats grouped memories into semantic XML tags for clean prompt consumption.
 * Sections are only included if they contain at least one selected memory.
 */
export function formatStructuredMemoryContext(
  categorized: Record<MemoryCategory, SelectedMemory[]>
): string {
  const sections: string[] = [];

  const categoryTags: Array<{ category: MemoryCategory; tag: string }> = [
    { category: "BRAND", tag: "brand_context" },
    { category: "AUDIENCE", tag: "audience_context" },
    { category: "CONTENT", tag: "content_context" },
    { category: "CAMPAIGN", tag: "campaign_context" },
    { category: "STRATEGIC", tag: "strategic_context" },
  ];

  for (const { category, tag } of categoryTags) {
    const items = categorized[category];
    if (items && items.length > 0) {
      const formattedItems = items
        .map((m) => `[${m.citationLabel}]\n${sanitizeMemoryText(m.text)}`)
        .join("\n\n");

      sections.push(`<${tag}>\n${formattedItems}\n</${tag}>`);
    }
  }

  if (sections.length === 0) {
    return "No verified Northstar memories available for this query.";
  }

  return `<northstar_memory>\n${sections.join("\n\n")}\n</northstar_memory>`;
}

/**
 * Builds the bounded, prioritized, and categorized memory context for the LLM.
 * Strictly limits total selected memories to maxMemories (default: MAX_CONTEXT_MEMORIES).
 */
export function buildMemoryContext(
  candidates: RetrievedMemory[],
  intent: QueryIntent,
  maxMemories: number = MAX_CONTEXT_MEMORIES
): {
  context: MemoryContext;
  selectedMemories: SelectedMemory[];
  budgetExcludedMemories: ExcludedMemory[];
} {
  // 1. Categorize all candidates
  const categorizedCandidates = candidates.map(categorizeMemory);

  // 2. Score priority deterministically
  const scoredCandidates: SelectedMemory[] = categorizedCandidates.map((mem) => {
    const { priority, selectionReason } = scoreMemoryPriority(mem, intent);
    return {
      ...mem,
      priority,
      selectionReason,
    };
  });

  // 3. Sort by priority descending
  scoredCandidates.sort((a, b) => b.priority - a.priority);

  // 4. Budget limit
  const selectedMemories = scoredCandidates.slice(0, maxMemories);
  const budgetExcludedMemories: ExcludedMemory[] = scoredCandidates
    .slice(maxMemories)
    .map((mem) => ({
      ...mem,
      reason: `budget_exceeded: Exceeded limit of ${maxMemories} memories (priority ${mem.priority})`,
    }));

  // 5. Group by category
  const categorized: Record<MemoryCategory, SelectedMemory[]> = {
    BRAND: [],
    AUDIENCE: [],
    CONTENT: [],
    CAMPAIGN: [],
    STRATEGIC: [],
  };

  for (const mem of selectedMemories) {
    categorized[mem.memoryCategory].push(mem);
  }

  // 6. Generate formatted prompt context
  const formattedPromptContext = formatStructuredMemoryContext(categorized);

  return {
    context: {
      categorized,
      allSelected: selectedMemories,
      formattedPromptContext,
      totalSelected: selectedMemories.length,
    },
    selectedMemories,
    budgetExcludedMemories,
  };
}
