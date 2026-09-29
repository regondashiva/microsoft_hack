import { QueryIntent } from "../strategist/types";
import { NORTHSTAR_CAMPAIGNS } from "./data";
import { StructuredCampaign } from "./types";

export interface CampaignContextResult {
  hasContext: boolean;
  selectedCampaigns: StructuredCampaign[];
  formattedContext: string;
  reason: string;
}

/**
 * Determines whether a user query warrants campaign performance context,
 * and if so, selects the most relevant campaigns query-aware.
 */
export function selectRelevantCampaignContext(
  query: string,
  intent: QueryIntent,
  campaigns: StructuredCampaign[] = NORTHSTAR_CAMPAIGNS
): CampaignContextResult {
  const normQuery = query.toLowerCase().trim();

  // 1. Strict Exclusions:
  // - Financial / revenue forecast queries: absolutely no campaign performance injection
  // - Pure voice / tone queries with no campaign mention: brand identity/voice must remain primary
  if (intent.isUnrelatedOrFinancialQuery) {
    return {
      hasContext: false,
      selectedCampaigns: [],
      formattedContext: "",
      reason: "Query is financial/revenue focused; campaign metrics excluded to prevent ungrounded forecasting.",
    };
  }

  // Check if query is explicitly asking about tone/voice and NOT asking about campaigns or performance
  const asksAboutCampaignOrPerformance =
    normQuery.includes("campaign") ||
    normQuery.includes("performance") ||
    normQuery.includes("work") || // "what worked"
    normQuery.includes("metric") ||
    normQuery.includes("result") ||
    normQuery.includes("post on linkedin") ||
    normQuery.includes("post on instagram") ||
    normQuery.includes("previous") ||
    normQuery.includes("test next") ||
    normQuery.includes("ctr") ||
    normQuery.includes("engagement") ||
    normQuery.includes("reach") ||
    normQuery.includes("convert");

  if (intent.isVoiceOrToneQuery && !asksAboutCampaignOrPerformance) {
    return {
      hasContext: false,
      selectedCampaigns: [],
      formattedContext: "",
      reason: "Query focuses strictly on brand voice and tone; campaign metrics excluded to maintain focus on brand memory.",
    };
  }

  // 2. Identify if query is campaign / performance relevant
  const isDirectCampaignQuery =
    intent.isCampaignQuery ||
    asksAboutCampaignOrPerformance ||
    normQuery.includes("what should we try next") ||
    normQuery.includes("what worked") ||
    normQuery.includes("which themes have performed") ||
    normQuery.includes("how did our previous");

  if (!isDirectCampaignQuery) {
    // If not asking about campaigns, performance, channel content, or testing next, exclude
    return {
      hasContext: false,
      selectedCampaigns: [],
      formattedContext: "",
      reason: "Query is not campaign or performance-oriented.",
    };
  }

  // 3. Channel-Specific Filtering
  let filteredCampaigns: StructuredCampaign[] = [];

  if (intent.channel === "linkedin") {
    filteredCampaigns = campaigns.filter((c) => c.channel === "linkedin");
  } else if (intent.channel === "instagram") {
    filteredCampaigns = campaigns.filter((c) => c.channel === "instagram");
  } else {
    // Multi-channel or general campaign query: include relevant campaigns across channels
    // Prioritize campaigns matching query keywords, or provide the key representative campaigns
    filteredCampaigns = [...campaigns];
  }

  // 4. Keyword / Topic alignment boost
  if (filteredCampaigns.length > 2 && intent.channel === undefined) {
    // Score campaigns based on keyword overlap
    const scored = filteredCampaigns.map((c) => {
      let score = 0;
      const textToSearch = `${c.name} ${c.contentTheme} ${c.objective} ${c.format}`.toLowerCase();
      for (const kw of intent.keywords) {
        if (textToSearch.includes(kw)) score += 2;
      }
      // Completed/Active campaigns with strong signal get base score
      if (c.status === "completed" || c.status === "active") score += 1;
      return { campaign: c, score };
    });

    scored.sort((a, b) => b.score - a.score);
    filteredCampaigns = scored.slice(0, 3).map((s) => s.campaign);
  }

  if (filteredCampaigns.length === 0) {
    return {
      hasContext: false,
      selectedCampaigns: [],
      formattedContext: "",
      reason: "No matching campaigns found for channel or topic filter.",
    };
  }

  // 5. Build structured XML representation
  const campaignBlocks = filteredCampaigns
    .map((c) => {
      const derived = c.performance.derived;
      const raw = c.performance.raw;
      const signalsList = c.performance.signals.map((s) => s.label).join(", ");
      const conversionLine =
        derived.conversionRate !== undefined
          ? `    <conversions>${raw.conversions}</conversions>\n    <conversion_rate>${derived.conversionRate}%</conversion_rate>`
          : "";

      return `  <campaign id="${c.id}">
    <name>${c.name}</name>
    <channel>${c.channel === "linkedin" ? "LinkedIn" : "Instagram"}</channel>
    <status>${c.status}</status>
    <period>${c.dateRange.label}</period>
    <theme>${c.contentTheme}</theme>
    <audience>${c.audience}</audience>
    <format>${c.format}</format>
    <performance_type>Synthetic Demo Data</performance_type>
    <impressions>${raw.impressions.toLocaleString()}</impressions>
    <reach>${raw.reach.toLocaleString()}</reach>
    <engagements>${raw.engagements.toLocaleString()}</engagements>
    <engagement_rate>${derived.engagementRate}%</engagement_rate>
    <clicks>${raw.clicks.toLocaleString()}</clicks>
    <ctr>${derived.clickThroughRate}%</ctr>
${conversionLine ? conversionLine + "\n" : ""}    <signals>${signalsList}</signals>
    <sample_observation>${c.keyTakeaway}</sample_observation>
  </campaign>`;
    })
    .join("\n\n");

  const formattedContext = `<campaign_performance>
  <!-- NOTICE: The campaign metrics below represent SYNTHETIC DEMONSTRATION DATA. Treat as illustrative product data, not verified real-world business results. -->
${campaignBlocks}
</campaign_performance>`;

  return {
    hasContext: true,
    selectedCampaigns: filteredCampaigns,
    formattedContext,
    reason: `Selected ${filteredCampaigns.length} relevant campaign(s) for ${intent.channel || "general"} query.`,
  };
}
