import { recallMemories } from "../hindsight/memory";
import { SafeMemoryResult } from "../hindsight/types";
import {
  ExcludedMemory,
  MemoryCategory,
  QueryIntent,
  RetrievedMemory,
} from "./types";

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "all", "an", "and", "any", "are",
  "as", "at", "be", "because", "been", "before", "being", "below", "between",
  "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during",
  "each", "few", "for", "from", "further", "had", "has", "have", "having",
  "he", "her", "here", "hers", "herself", "him", "himself", "his", "how",
  "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me", "more",
  "most", "my", "myself", "no", "nor", "not", "now", "of", "off", "on", "once",
  "only", "or", "other", "our", "ours", "ourselves", "out", "over", "own",
  "same", "she", "should", "so", "some", "such", "than", "that", "the", "their",
  "theirs", "them", "themselves", "then", "there", "these", "they", "this",
  "those", "through", "to", "too", "under", "until", "up", "very", "was",
  "we", "were", "what", "when", "where", "which", "while", "who", "whom",
  "why", "with", "would", "you", "your", "yours", "yourself", "yourselves",
  "give", "tell", "show", "can",
]);

/**
 * Extracts clean, non-stop keyword tokens from a natural language query.
 */
export function extractQueryKeywords(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Analyzes the user's strategic query to detect channel focus, audience targets,
 * topic intent, and prioritized memory categories.
 */
export function analyzeQuery(query: string): QueryIntent {
  const rawQuery = query;
  const normalizedQuery = query.toLowerCase().trim();
  const keywords = extractQueryKeywords(normalizedQuery);

  // Channel detection
  const mentionsLinkedin = normalizedQuery.includes("linkedin");
  const mentionsInstagram =
    normalizedQuery.includes("instagram") ||
    normalizedQuery.includes("insta") ||
    /\big\b/.test(normalizedQuery);

  let channel: "linkedin" | "instagram" | "all" | undefined;
  if (mentionsLinkedin && !mentionsInstagram) {
    channel = "linkedin";
  } else if (mentionsInstagram && !mentionsLinkedin) {
    channel = "instagram";
  } else if (mentionsLinkedin && mentionsInstagram) {
    channel = "all";
  }

  // Audience target detection
  const mentionsYoungPro =
    normalizedQuery.includes("young professional") ||
    normalizedQuery.includes("young professionals") ||
    normalizedQuery.includes("22-34") ||
    normalizedQuery.includes("22–34") ||
    normalizedQuery.includes("gen z") ||
    normalizedQuery.includes("millennial") ||
    normalizedQuery.includes("career growth");

  const mentionsSmallBiz =
    normalizedQuery.includes("small business") ||
    normalizedQuery.includes("founder") ||
    normalizedQuery.includes("business owners") ||
    normalizedQuery.includes("entrepreneur") ||
    normalizedQuery.includes("b2b");

  let audienceTarget: "young_professionals" | "small_business" | "general" = "general";
  if (mentionsYoungPro && !mentionsSmallBiz) {
    audienceTarget = "young_professionals";
  } else if (mentionsSmallBiz && !mentionsYoungPro) {
    audienceTarget = "small_business";
  }

  // Intent classification
  const isVoiceOrToneQuery =
    normalizedQuery.includes("tone") ||
    normalizedQuery.includes("voice") ||
    normalizedQuery.includes("style") ||
    normalizedQuery.includes("sound") ||
    normalizedQuery.includes("manner") ||
    normalizedQuery.includes("personality") ||
    normalizedQuery.includes("speak");

  const isCampaignQuery =
    normalizedQuery.includes("campaign") ||
    normalizedQuery.includes("previous") ||
    normalizedQuery.includes("past") ||
    normalizedQuery.includes("history") ||
    normalizedQuery.includes("work smarter") ||
    normalizedQuery.includes("productivity without the noise") ||
    normalizedQuery.includes("practical tech guide") ||
    normalizedQuery.includes("behind the workflow");

  const isAudienceQuery =
    normalizedQuery.includes("audience") ||
    normalizedQuery.includes("target") ||
    normalizedQuery.includes("demographic") ||
    normalizedQuery.includes("segment") ||
    normalizedQuery.includes("who") ||
    mentionsYoungPro ||
    mentionsSmallBiz;

  const isContentIdeaQuery =
    normalizedQuery.includes("post") ||
    normalizedQuery.includes("create") ||
    normalizedQuery.includes("content") ||
    normalizedQuery.includes("idea") ||
    normalizedQuery.includes("theme") ||
    normalizedQuery.includes("publish") ||
    normalizedQuery.includes("topic") ||
    normalizedQuery.includes("what should");

  const isUnrelatedOrFinancialQuery =
    normalizedQuery.includes("revenue") ||
    normalizedQuery.includes("financial") ||
    normalizedQuery.includes("forecast") ||
    normalizedQuery.includes("profit") ||
    normalizedQuery.includes("earnings") ||
    normalizedQuery.includes("valuation") ||
    normalizedQuery.includes("investor") ||
    normalizedQuery.includes("2027") ||
    normalizedQuery.includes("stock") ||
    normalizedQuery.includes("ebitda");

  // Determine prioritized category order dynamically based on query analysis
  let targetCategories: MemoryCategory[];

  if (isVoiceOrToneQuery) {
    targetCategories = ["BRAND", "CONTENT", "CAMPAIGN", "AUDIENCE", "STRATEGIC"];
  } else if (isCampaignQuery) {
    targetCategories = ["CAMPAIGN", "CONTENT", "BRAND", "AUDIENCE", "STRATEGIC"];
  } else if (isAudienceQuery) {
    targetCategories = ["AUDIENCE", "BRAND", "CONTENT", "CAMPAIGN", "STRATEGIC"];
  } else if (isContentIdeaQuery) {
    targetCategories = ["BRAND", "CONTENT", "CAMPAIGN", "AUDIENCE", "STRATEGIC"];
  } else {
    targetCategories = ["BRAND", "AUDIENCE", "CONTENT", "CAMPAIGN", "STRATEGIC"];
  }

  return {
    rawQuery,
    normalizedQuery,
    targetCategories,
    channel,
    audienceTarget,
    isVoiceOrToneQuery,
    isCampaignQuery,
    isAudienceQuery,
    isContentIdeaQuery,
    isUnrelatedOrFinancialQuery,
    keywords,
  };
}

/**
 * Normalizes raw Hindsight SafeMemoryResult items into typed RetrievedMemory records.
 * Uses genuine relevance scores from Hindsight when available; never fabricates them.
 */
export function normalizeMemory(item: SafeMemoryResult, index: number): RetrievedMemory {
  return {
    id: item.id || `mem-${index}`,
    text: item.text.trim(),
    type: item.type || "world",
    category: item.category,
    context: item.context,
    score: typeof item.score === "number" && !isNaN(item.score) ? item.score : undefined,
    metadata: item.metadata,
  };
}

/**
 * Removes duplicate or near-identical memories while preserving the most descriptive version.
 */
export function deduplicateMemories(memories: RetrievedMemory[]): {
  uniqueMemories: RetrievedMemory[];
  duplicateMemories: ExcludedMemory[];
} {
  const seenTexts = new Map<string, RetrievedMemory>();
  const seenIds = new Set<string>();
  const uniqueMemories: RetrievedMemory[] = [];
  const duplicateMemories: ExcludedMemory[] = [];

  for (const mem of memories) {
    // Exact ID check
    if (seenIds.has(mem.id)) {
      duplicateMemories.push({
        ...mem,
        reason: "duplicate_id: Memory with identical ID already retrieved",
      });
      continue;
    }

    // Normalized text check
    const normalizedText = mem.text
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    if (seenTexts.has(normalizedText)) {
      duplicateMemories.push({
        ...mem,
        reason: "duplicate_content: Memory with identical text already retrieved",
      });
      continue;
    }

    seenIds.add(mem.id);
    seenTexts.set(normalizedText, mem);
    uniqueMemories.push(mem);
  }

  return { uniqueMemories, duplicateMemories };
}

/**
 * Evaluates whether a memory is explicitly contradictory or irrelevant to a channel-specific
 * or audience-specific query constraint.
 */
export function filterIrrelevantMemories(
  memories: RetrievedMemory[],
  intent: QueryIntent
): {
  candidateMemories: RetrievedMemory[];
  excludedMemories: ExcludedMemory[];
} {
  const candidateMemories: RetrievedMemory[] = [];
  const excludedMemories: ExcludedMemory[] = [];

  for (const mem of memories) {
    const textLower = mem.text.toLowerCase();
    const contextLower = (mem.context || "").toLowerCase();

    // 1. Channel Filter: If query explicitly asks about Instagram campaigns, exclude non-Instagram campaign history
    if (intent.channel === "instagram" && intent.isCampaignQuery) {
      const isInstagramMemory =
        textLower.includes("instagram") || contextLower.includes("instagram");
      const isLinkedinCampaign =
        (textLower.includes("linkedin") || contextLower.includes("linkedin")) &&
        (textLower.includes("campaign") || contextLower.includes("campaign"));

      if (isLinkedinCampaign && !isInstagramMemory) {
        excludedMemories.push({
          ...mem,
          reason: "channel_mismatch: Query specifically targets Instagram campaigns",
        });
        continue;
      }
    }

    // 2. Channel Filter: If query explicitly asks about LinkedIn, exclude purely Instagram campaign history
    if (intent.channel === "linkedin" && intent.isCampaignQuery) {
      const isLinkedinMemory =
        textLower.includes("linkedin") || contextLower.includes("linkedin");
      const isInstagramCampaign =
        (textLower.includes("instagram") || contextLower.includes("instagram")) &&
        (textLower.includes("campaign") || contextLower.includes("campaign"));

      if (isInstagramCampaign && !isLinkedinMemory) {
        excludedMemories.push({
          ...mem,
          reason: "channel_mismatch: Query specifically targets LinkedIn campaigns",
        });
        continue;
      }
    }

    // 3. Audience Filter: If query explicitly targets young professionals, exclude secondary audience (small businesses)
    if (intent.audienceTarget === "young_professionals" && intent.isAudienceQuery) {
      const isSmallBiz =
        mem.category === "secondary_audience" ||
        contextLower.includes("audience expansion") ||
        (textLower.includes("small business") && !textLower.includes("young professional"));

      if (isSmallBiz) {
        excludedMemories.push({
          ...mem,
          reason: "audience_mismatch: Query specifically targets young professionals (22–34)",
        });
        continue;
      }
    }

    // 4. Audience Filter: If query explicitly targets small businesses, exclude young professional specifics
    if (intent.audienceTarget === "small_business" && intent.isAudienceQuery) {
      const isYoungProSpecific =
        mem.category === "audience_segment" ||
        (textLower.includes("22–34") && !textLower.includes("small business"));

      if (isYoungProSpecific) {
        excludedMemories.push({
          ...mem,
          reason: "audience_mismatch: Query specifically targets small business audience",
        });
        continue;
      }
    }

    candidateMemories.push(mem);
  }

  return { candidateMemories, excludedMemories };
}

/**
 * Executes memory recall against Hindsight, normalizes items, removes duplicates,
 * and performs preliminary relevance filtering based on query intent.
 */
export async function retrieveMemoriesForQuery(query: string): Promise<{
  retrievedMemories: RetrievedMemory[];
  candidateMemories: RetrievedMemory[];
  excludedMemories: ExcludedMemory[];
  queryIntent: QueryIntent;
}> {
  const intent = analyzeQuery(query);

  // 1. Call Hindsight Recall
  const recallResult = await recallMemories(query);
  const rawResults = recallResult.results ?? [];

  // 2. Normalize results
  const retrievedMemories = rawResults.map((item, idx) => normalizeMemory(item, idx));

  // 3. Deduplicate
  const { uniqueMemories, duplicateMemories } = deduplicateMemories(retrievedMemories);

  // 4. Filter obviously irrelevant / mismatched records
  const { candidateMemories, excludedMemories } = filterIrrelevantMemories(
    uniqueMemories,
    intent
  );

  return {
    retrievedMemories,
    candidateMemories,
    excludedMemories: [...duplicateMemories, ...excludedMemories],
    queryIntent: intent,
  };
}
