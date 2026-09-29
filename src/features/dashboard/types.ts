import { Brand } from "@/types";

/**
 * Static brand context for Northstar Brand Co.
 * Campaign data is managed via CampaignProvider in features/campaigns/campaign-store.tsx.
 */
export interface AudienceContextData {
  primaryAudience: string;
  contentPreference: string;
  preferredTone: string;
  avoidApproach: string;
}

export interface ContentDirectionData {
  primaryThemes: string[];
  brandVoiceTraits: string[];
}

export interface BrandPageData {
  brand: Brand;
  audienceContext: AudienceContextData;
  contentDirection: ContentDirectionData;
}
