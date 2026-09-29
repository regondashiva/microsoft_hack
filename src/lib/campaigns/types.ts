/**
 * Core type definitions for the Northstar Campaign & Performance Intelligence layer.
 * All performance metrics in this layer represent SYNTHETIC DEMO DATA for product reasoning.
 */

export type CampaignChannel = "linkedin" | "instagram" | "x" | "youtube" | "email";

export type CampaignStatus = "completed" | "active" | "planned" | "draft";

export interface CampaignDateRange {
  start: string; // ISO date or formatted date (e.g. "2026-09-01")
  end?: string;
  label: string; // User-facing display e.g. "Sept 1 – Sept 15, 2026"
}

export interface CampaignRawMetrics {
  impressions: number;
  reach: number;
  engagements: number;
  clicks: number;
  conversions?: number;
}

export interface CampaignDerivedMetrics {
  engagementRate: number; // (engagements / reach) * 100
  clickThroughRate: number; // (clicks / impressions) * 100
  conversionRate?: number; // (conversions / clicks) * 100
}

export type PerformanceSignalType =
  | "HIGH_ENGAGEMENT_RATE"
  | "MODERATE_ENGAGEMENT"
  | "LOWER_RELATIVE_ENGAGEMENT"
  | "STRONG_CTR"
  | "MODERATE_CTR"
  | "BROAD_REACH"
  | "HIGH_CLICK_VOLUME"
  | "STRONG_AUDIENCE_RESPONSE";

export interface PerformanceSignal {
  type: PerformanceSignalType;
  label: string;
  description: string;
}

export interface CampaignPerformance {
  raw: CampaignRawMetrics;
  derived: CampaignDerivedMetrics;
  signals: PerformanceSignal[];
  isSynthetic: true;
  disclaimer: string;
}

export interface StructuredCampaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  dateRange: CampaignDateRange;
  objective: string;
  audience: string;
  contentTheme: string;
  format: string;
  summary: string;
  performance: CampaignPerformance;
  keyTakeaway: string;
}

export interface CampaignInsight {
  id: string;
  title: string;
  observation: string;
  channel?: CampaignChannel;
  supportingCampaignIds: string[];
  isSynthetic: true;
  category: "channel_comparison" | "theme_performance" | "format_effectiveness" | "strategic_signal";
}

export const SYNTHETIC_DATA_DISCLAIMER =
  "Synthetic demo performance data — used to demonstrate campaign intelligence, not verified real-world business performance.";
