import { SelectedMemory, QueryIntent } from "../types";
import { StructuredCampaign } from "@/lib/campaigns/types";
import {
  StrategyExplanation,
  MemoryEvidenceItem,
  CampaignEvidenceItem,
  RecommendationExplanation,
  VisualEvidenceStep,
  ProvenanceSource,
  ProvenanceLabel,
} from "./types";

interface BuildExplanationParams {
  query: string;
  summary: string;
  recommendations: Array<{ title: string; description: string }>;
  reasoning: string;
  memoryUsed: string[];
  selectedMemories: SelectedMemory[];
  selectedCampaigns: StructuredCampaign[];
  queryIntent?: QueryIntent;
}

/**
 * Maps raw memory metadata to standard provenance labels.
 */
function resolveProvenance(memory: SelectedMemory): {
  source: ProvenanceSource;
  sourceLabel: ProvenanceLabel;
} {
  const rawSource = memory.source || memory.metadata?.source || "";

  if (rawSource === "user_taught") {
    return { source: "user_taught", sourceLabel: "User Taught" };
  }
  if (rawSource === "user_feedback") {
    return { source: "user_feedback", sourceLabel: "User Feedback" };
  }
  if (
    rawSource === "campaign_history" ||
    memory.metadata?.source === "campaign_history" ||
    memory.category === "campaign_history"
  ) {
    return { source: "campaign_history", sourceLabel: "Campaign History" };
  }
  return { source: "seeded", sourceLabel: "Seeded Brand Knowledge" };
}

/**
 * Builds a deterministic, factual explainability package connecting
 * user queries, Hindsight memories, campaign evidence, and strategic reasoning.
 *
 * Separation of Concerns:
 * - Application layer controls all facts (counts, sources, text, metrics, disclaimers).
 * - Natural language synthesis explains the strategic connection clearly.
 */
export function buildStrategyExplanation({
  summary,
  recommendations,
  reasoning,
  selectedMemories,
  selectedCampaigns,
  queryIntent,
}: BuildExplanationParams): StrategyExplanation {
  // 1. Build Factual Memory Evidence
  const memoryEvidence: MemoryEvidenceItem[] = selectedMemories.map((m) => {
    const { source, sourceLabel } = resolveProvenance(m);
    return {
      id: m.id,
      category: m.category || m.memoryCategory || "BRAND",
      citationLabel: m.citationLabel || `[${m.category || "BRAND"}: ${m.id}]`,
      source,
      sourceLabel,
      content: m.text,
      context: m.context,
    };
  });

  // 2. Build Factual Campaign Evidence
  const campaignEvidence: CampaignEvidenceItem[] = selectedCampaigns.map((camp) => ({
    id: camp.id,
    name: camp.name,
    channel: camp.channel,
    status: camp.status,
    contentTheme: camp.contentTheme,
    format: camp.format,
    keyTakeaway: camp.keyTakeaway,
    impressions: camp.performance.raw.impressions,
    reach: camp.performance.raw.reach,
    engagementRate: camp.performance.derived.engagementRate,
    clickThroughRate: camp.performance.derived.clickThroughRate,
    signals: camp.performance.signals.map((s) => s.label),
    isSynthetic: true as const,
    disclaimer: camp.performance.disclaimer,
  }));

  // 3. Honest Evidence Counts (Application Controlled)
  const memCount = memoryEvidence.length;
  const campCount = campaignEvidence.length;
  const countLabel = `${memCount} verified ${
    memCount === 1 ? "memory" : "memories"
  } · ${campCount} relevant ${campCount === 1 ? "campaign" : "campaigns"}`;

  // 4. Missing Evidence Indicators
  const hasMissingMemory = memCount === 0;
  const hasMissingCampaign = campCount === 0;

  const memoryNote = hasMissingMemory
    ? "No directly supporting memory was retrieved for this recommendation."
    : undefined;

  const campaignNote = hasMissingCampaign
    ? queryIntent?.isVoiceOrToneQuery
      ? "Brand voice and tone queries rely directly on core brand memory; campaign metrics were intentionally not selected."
      : "No relevant campaign records were selected for this question."
    : undefined;

  // 5. High-Level Strategic Connection
  let strategicConnection = "";
  if (memCount > 0 && campCount > 0) {
    const topCamp = campaignEvidence[0];
    const topMem = memoryEvidence[0];
    strategicConnection = `MemoryAI connected Northstar's remembered preference for "${topMem.citationLabel}" with observed performance from the ${topCamp.name} campaign (${topCamp.channel.toUpperCase()}). The recommendation bridges brand expectations with historical format efficiency.`;
  } else if (memCount > 0) {
    strategicConnection = `MemoryAI grounded this strategy in Northstar's verified persistent memory. Recommendations prioritize core brand identity, audience preferences, and messaging guardrails without relying on synthetic campaign metrics.`;
  } else if (campCount > 0) {
    strategicConnection = `MemoryAI based this strategy on relevant historical campaign benchmarks from synthetic demonstration records, evaluating format effectiveness and engagement trends.`;
  } else {
    strategicConnection = `No specific brand memories or campaign benchmarks were available for this question. Recommendations adhere strictly to default strategic guidelines.`;
  }

  // 6. Recommendation-Level Explanations
  const recommendationExplanations: RecommendationExplanation[] = recommendations.map(
    (rec) => {
      // Find supporting memory citations
      const matchingMemories = memoryEvidence
        .slice(0, 3)
        .map((m) => m.citationLabel);

      // Find supporting campaign names
      const matchingCampaigns = campaignEvidence
        .slice(0, 2)
        .map((c) => c.name);

      let connectionText = "";
      if (matchingMemories.length > 0 && matchingCampaigns.length > 0) {
        connectionText = `The recommendation combines Northstar's remembered audience preference (${matchingMemories.join(
          ", "
        )}) with available campaign evidence from ${matchingCampaigns.join(" and ")}.`;
      } else if (matchingMemories.length > 0) {
        connectionText = `The recommendation is grounded in Northstar's remembered guidelines (${matchingMemories.join(
          ", "
        )}).`;
      } else if (matchingCampaigns.length > 0) {
        connectionText = `The recommendation reflects format observations from ${matchingCampaigns.join(
          ", "
        )}.`;
      } else {
        connectionText = `Recommendation derived from general content strategy best practices.`;
      }

      return {
        recommendationTitle: rec.title,
        whyFits: reasoning || "Aligns with Northstar's positioning and tone principles.",
        supportingMemories: matchingMemories,
        supportingCampaigns: matchingCampaigns,
        strategicConnection: connectionText,
      };
    }
  );

  // 7. Visual Evidence Flow Chain
  const visualFlow: VisualEvidenceStep[] = [
    {
      step: "memory",
      badge: "PERSISTENT MEMORY",
      title: memCount > 0 ? "What Northstar Remembers" : "Memory Status",
      detail:
        memCount > 0
          ? `${memoryEvidence[0].citationLabel}: "${memoryEvidence[0].content.slice(0, 110)}${
              memoryEvidence[0].content.length > 110 ? "..." : ""
            }"`
          : "No specific memory was retrieved for this query.",
    },
    {
      step: "campaign",
      badge: "CAMPAIGN EVIDENCE",
      title: campCount > 0 ? "Relevant Campaign Benchmark" : "Campaign Context",
      detail:
        campCount > 0
          ? `${campaignEvidence[0].name} (${campaignEvidence[0].channel.toUpperCase()}): ${
              campaignEvidence[0].keyTakeaway
            } (Synthetic demo data)`
          : queryIntent?.isVoiceOrToneQuery
          ? "Excluded — tone & voice queries prioritize brand memory over campaign metrics."
          : "No relevant campaign records were selected for this topic.",
    },
    {
      step: "reasoning",
      badge: "STRATEGIC REASONING",
      title: "Why This Fits Northstar",
      detail:
        reasoning.length > 130
          ? `${reasoning.slice(0, 130)}...`
          : reasoning,
    },
    {
      step: "recommendation",
      badge: "ACTIONABLE OUTPUT",
      title: "Strategy Formulation",
      detail:
        recommendations.length > 0
          ? `[${recommendations[0].title}] ${recommendations[0].description}`
          : summary,
    },
  ];

  return {
    hasEvidence: memCount > 0 || campCount > 0,
    evidenceCounts: {
      memories: memCount,
      campaigns: campCount,
      label: countLabel,
    },
    memoryEvidence,
    campaignEvidence,
    strategicConnection,
    visualFlow,
    recommendationExplanations,
    missingEvidence: {
      hasMissingMemory,
      memoryNote,
      hasMissingCampaign,
      campaignNote,
    },
  };
}
