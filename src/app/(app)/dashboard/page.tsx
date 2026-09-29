"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { BrandContextSection } from "@/components/dashboard/brand-context-section";
import { RecentCampaignsSection } from "@/components/dashboard/recent-campaigns-section";
import { AudienceContextSection } from "@/components/dashboard/audience-context-section";
import { ContentDirectionSection } from "@/components/dashboard/content-direction-section";
import { useCampaigns } from "@/features/campaigns/campaign-store";
import { Brand } from "@/types";

// Static brand configuration for Northstar Brand Co.
const northstarBrand: Brand = {
  id: "brand-northstar-01",
  name: "Northstar",
  tagline: "Practical technology for focused work and living.",
  industry: "Consumer Technology",
  website: "https://northstarbrand.example",
  targetMarket: "Young professionals and digitally engaged consumers",
  currentObjective: "Build trust through useful, clear and practical content.",
  voice: {
    archetype: "Practical Guide",
    toneKeywords: ["Clear", "Confident", "Approachable", "Evidence-Aware"],
    guidelines: [],
  },
  contentPreferences: {
    primaryFormats: ["Practical Workflow Breakdowns", "Visual Tip Carousels", "Customer Case Stories"],
    preferredPillars: ["Practical Education", "Product Use Cases", "Industry Insights", "Customer Stories"],
    dislikedTopics: ["Overly promotional hype", "Unsubstantiated trend speculation"],
    targetReadingLevel: "Clear, conversational, professional",
  },
  guardrails: [],
  createdAt: "2026-09-01T00:00:00Z",
  updatedAt: "2026-09-28T00:00:00Z",
};

const audienceContext = {
  primaryAudience: "Young professionals",
  contentPreference: "Practical, educational and concise",
  preferredTone: "Clear, confident and approachable",
  avoidApproach: "Overly promotional messaging",
};

const contentDirection = {
  primaryThemes: [
    "Practical education",
    "Product use cases",
    "Industry insights",
    "Customer stories",
  ],
  brandVoiceTraits: ["Clear", "Confident", "Approachable", "Evidence-aware"],
};

export default function DashboardPage() {
  const { campaigns } = useCampaigns();

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Strategy Overview"
        description="A working view of the brand context, audience, campaigns and content direction."
      />

      <section>
        <BrandContextSection brand={northstarBrand} />
      </section>

      <section>
        <RecentCampaignsSection campaigns={campaigns} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <section>
          <AudienceContextSection audience={audienceContext} />
        </section>
        <section>
          <ContentDirectionSection direction={contentDirection} />
        </section>
      </div>
    </div>
  );
}
