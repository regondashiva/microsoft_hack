/**
 * Campaign data structure representing past, active, and planned initiatives for Northstar Brand Co.
 */

export type CampaignStatus = "draft" | "planned" | "active" | "completed";

export type DistributionPlatform =
  | "linkedin"
  | "instagram"
  | "x"
  | "youtube"
  | "website"
  | "email"
  | "cross_platform";

export interface Campaign {
  id: string;
  name: string;
  description: string;
  platform: DistributionPlatform;
  status: CampaignStatus;
  campaignDate: string; // ISO date string e.g. "2026-09-15" or month string
  contentObjective?: string;
  targetAudience?: string;
  createdAt: string;
}
