import { CampaignInsight, StructuredCampaign } from "./types";

/**
 * Calculates deterministic insights and observations across the synthetic campaign dataset.
 * All generated observations explicitly label themselves as findings from the demo dataset.
 */
export function calculateCampaignInsights(
  campaigns: StructuredCampaign[]
): CampaignInsight[] {
  const insights: CampaignInsight[] = [];

  if (!campaigns || campaigns.length === 0) {
    return insights;
  }

  const linkedinCampaigns = campaigns.filter((c) => c.channel === "linkedin");
  const instagramCampaigns = campaigns.filter((c) => c.channel === "instagram");

  // 1. Channel Performance Comparison
  if (linkedinCampaigns.length > 0 && instagramCampaigns.length > 0) {
    const avgLiEngRate =
      linkedinCampaigns.reduce((acc, c) => acc + c.performance.derived.engagementRate, 0) /
      linkedinCampaigns.length;
    const avgIgEngRate =
      instagramCampaigns.reduce((acc, c) => acc + c.performance.derived.engagementRate, 0) /
      instagramCampaigns.length;

    const avgLiCtr =
      linkedinCampaigns.reduce((acc, c) => acc + c.performance.derived.clickThroughRate, 0) /
      linkedinCampaigns.length;
    const avgIgCtr =
      instagramCampaigns.reduce((acc, c) => acc + c.performance.derived.clickThroughRate, 0) /
      instagramCampaigns.length;

    const avgIgReach =
      instagramCampaigns.reduce((acc, c) => acc + c.performance.raw.reach, 0) /
      instagramCampaigns.length;
    const avgLiReach =
      linkedinCampaigns.reduce((acc, c) => acc + c.performance.raw.reach, 0) /
      linkedinCampaigns.length;

    insights.push({
      id: "insight-channel-engagement",
      title: "Channel Engagement Pattern",
      observation: `In this sample dataset, LinkedIn campaigns exhibited higher average engagement rates (${avgLiEngRate.toFixed(2)}% vs ${avgIgEngRate.toFixed(2)}%) and stronger click-through rates (${avgLiCtr.toFixed(2)}% vs ${avgIgCtr.toFixed(2)}%) than Instagram campaigns.`,
      supportingCampaignIds: campaigns.map((c) => c.id),
      isSynthetic: true,
      category: "channel_comparison",
    });

    insights.push({
      id: "insight-channel-reach",
      title: "Reach Volume Distribution",
      observation: `In the demo dataset, Instagram campaigns achieved higher audience reach per campaign (average ${Math.round(avgIgReach).toLocaleString()} vs ${Math.round(avgLiReach).toLocaleString()}), but sustained lower relative interaction rates compared to LinkedIn.`,
      supportingCampaignIds: campaigns.map((c) => c.id),
      isSynthetic: true,
      category: "channel_comparison",
    });
  }

  // 2. Theme & Content Type Observations
  const techGuide = campaigns.find((c) => c.id === "camp-03");
  const productivity = campaigns.find((c) => c.id === "camp-01");
  if (techGuide && productivity) {
    insights.push({
      id: "insight-theme-practical-education",
      title: "Practical Software & Workflow Teardowns",
      observation: `Within the sample campaign data, practical educational breakdowns (e.g. 'The Practical Tech Guide' at ${techGuide.performance.derived.engagementRate}% engagement and 'Productivity Without the Noise' at ${productivity.performance.derived.engagementRate}%) outperformed abstract brand messaging in click engagement.`,
      channel: "linkedin",
      supportingCampaignIds: [techGuide.id, productivity.id],
      isSynthetic: true,
      category: "theme_performance",
    });
  }

  // 3. Format Observations
  const reelsCampaign = campaigns.find((c) => c.id === "camp-02");
  const carouselCampaign = campaigns.find((c) => c.id === "camp-04");
  if (reelsCampaign && carouselCampaign) {
    insights.push({
      id: "insight-format-instagram",
      title: "Instagram Visual Format Dynamics",
      observation: `Across the demonstration Instagram records, carousel teardowns in 'Behind the Workflow' achieved higher engagement (${carouselCampaign.performance.derived.engagementRate}%) compared to video reels in 'Work Smarter, Not Louder' (${reelsCampaign.performance.derived.engagementRate}%), despite reels achieving broader total reach.`,
      channel: "instagram",
      supportingCampaignIds: [reelsCampaign.id, carouselCampaign.id],
      isSynthetic: true,
      category: "format_effectiveness",
    });
  }

  return insights;
}
