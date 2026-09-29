import {
  CampaignDerivedMetrics,
  CampaignRawMetrics,
  PerformanceSignal,
} from "./types";

/**
 * Calculates engagement rate deterministically: (engagements / reach) * 100.
 * Safely guards against division by zero.
 */
export function calculateEngagementRate(engagements: number, reach: number): number {
  if (reach <= 0 || isNaN(reach) || isNaN(engagements) || engagements < 0) {
    return 0;
  }
  const rate = (engagements / reach) * 100;
  return Number(rate.toFixed(2));
}

/**
 * Calculates click-through rate (CTR) deterministically: (clicks / impressions) * 100.
 * Safely guards against division by zero.
 */
export function calculateCTR(clicks: number, impressions: number): number {
  if (impressions <= 0 || isNaN(impressions) || isNaN(clicks) || clicks < 0) {
    return 0;
  }
  const rate = (clicks / impressions) * 100;
  return Number(rate.toFixed(2));
}

/**
 * Calculates conversion rate deterministically: (conversions / clicks) * 100.
 * Returns undefined if conversions are not tracked for this campaign, or 0 if clicks <= 0.
 */
export function calculateConversionRate(
  conversions: number | undefined,
  clicks: number
): number | undefined {
  if (conversions === undefined || isNaN(conversions)) {
    return undefined;
  }
  if (clicks <= 0 || isNaN(clicks) || conversions < 0) {
    return 0;
  }
  const rate = (conversions / clicks) * 100;
  return Number(rate.toFixed(2));
}

/**
 * Derives all calculated metrics from raw performance figures.
 * Single source of truth for campaign performance calculations.
 */
export function deriveCampaignMetrics(raw: CampaignRawMetrics): CampaignDerivedMetrics {
  return {
    engagementRate: calculateEngagementRate(raw.engagements, raw.reach),
    clickThroughRate: calculateCTR(raw.clicks, raw.impressions),
    conversionRate: calculateConversionRate(raw.conversions, raw.clicks),
  };
}

/**
 * Derives qualitative performance signals based on deterministic thresholds.
 * Clearly framed as product-level interpretations of the synthetic dataset.
 */
export function derivePerformanceSignals(
  raw: CampaignRawMetrics,
  derived: CampaignDerivedMetrics
): PerformanceSignal[] {
  const signals: PerformanceSignal[] = [];

  // Engagement Rate signals
  if (derived.engagementRate >= 4.5) {
    signals.push({
      type: "HIGH_ENGAGEMENT_RATE",
      label: "High Engagement Rate",
      description: `Sample engagement rate of ${derived.engagementRate}% exceeds benchmark expectations.`,
    });
  } else if (derived.engagementRate >= 3.0) {
    signals.push({
      type: "MODERATE_ENGAGEMENT",
      label: "Moderate Engagement",
      description: `Sample engagement rate of ${derived.engagementRate}% demonstrates solid audience interaction.`,
    });
  } else {
    signals.push({
      type: "LOWER_RELATIVE_ENGAGEMENT",
      label: "Lower Relative Engagement",
      description: `Sample engagement rate of ${derived.engagementRate}% suggests broader casual views with lower interaction.`,
    });
  }

  // Click-Through Rate signals
  if (derived.clickThroughRate >= 2.0) {
    signals.push({
      type: "STRONG_CTR",
      label: "Strong Click-Through Rate",
      description: `Sample CTR of ${derived.clickThroughRate}% indicates high action-oriented interest in content links.`,
    });
  } else if (derived.clickThroughRate >= 1.0) {
    signals.push({
      type: "MODERATE_CTR",
      label: "Moderate CTR",
      description: `Sample CTR of ${derived.clickThroughRate}% shows steady navigation to external resources.`,
    });
  }

  // Reach volume signals
  if (raw.reach >= 20000) {
    signals.push({
      type: "BROAD_REACH",
      label: "Broad Audience Reach",
      description: `Reached over ${raw.reach.toLocaleString()} unique accounts in this demonstration record.`,
    });
  }

  // Click volume signals
  if (raw.clicks >= 350) {
    signals.push({
      type: "HIGH_CLICK_VOLUME",
      label: "Strong Link Click Volume",
      description: `Generated ${raw.clicks.toLocaleString()} link clicks across the campaign period.`,
    });
  }

  return signals;
}
