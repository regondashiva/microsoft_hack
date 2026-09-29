import { CampaignStatus, DistributionPlatform } from "@/types";

export interface CampaignFilterOptions {
  status?: CampaignStatus | "all";
  platform?: DistributionPlatform | "all";
  searchQuery?: string;
  sortBy?: "date" | "performance" | "impressions";
}

export interface CampaignSummaryMetrics {
  totalCampaigns: number;
  activeCount: number;
  averagePerformanceScore: number;
  totalImpressions: number;
}
