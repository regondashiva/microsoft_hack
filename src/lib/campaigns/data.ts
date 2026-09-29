import { deriveCampaignMetrics, derivePerformanceSignals } from "./metrics";
import {
  CampaignRawMetrics,
  StructuredCampaign,
  SYNTHETIC_DATA_DISCLAIMER,
} from "./types";

interface CampaignDefinition {
  id: string;
  name: string;
  channel: "linkedin" | "instagram";
  status: "completed" | "active" | "planned" | "draft";
  dateRange: {
    start: string;
    end?: string;
    label: string;
  };
  objective: string;
  audience: string;
  contentTheme: string;
  format: string;
  summary: string;
  rawMetrics: CampaignRawMetrics;
  keyTakeaway: string;
}

const CAMPAIGN_DEFINITIONS: CampaignDefinition[] = [
  {
    id: "camp-01",
    name: "Productivity Without the Noise",
    channel: "linkedin",
    status: "completed",
    dateRange: {
      start: "2026-09-01",
      end: "2026-09-15",
      label: "Sept 1 – Sept 15, 2026",
    },
    objective: "Help professionals reduce notification clutter and streamline daily tools.",
    audience: "Young professionals and team leads seeking focused productivity",
    contentTheme: "Digital Minimalism & Intentional Workflows",
    format: "Multi-slide carousel breakdowns & actionable text checklists",
    summary:
      "Educational campaign focused on practical productivity workflows, reducing digital distractions, and consolidating notifications for knowledge workers.",
    rawMetrics: {
      impressions: 18500,
      reach: 14200,
      engagements: 680,
      clicks: 420,
      conversions: 48,
    },
    keyTakeaway:
      "Actionable carousel breakdowns drove above-average engagement and solid link click volume among young professionals.",
  },
  {
    id: "camp-02",
    name: "Work Smarter, Not Louder",
    channel: "instagram",
    status: "active",
    dateRange: {
      start: "2026-09-18",
      end: "2026-10-02",
      label: "Sept 18 – Oct 2, 2026",
    },
    objective: "Engage audience with bite-sized daily workflow improvements.",
    audience: "Digitally engaged knowledge workers & creative professionals",
    contentTheme: "Actionable Daily Habits & Calm Efficiency",
    format: "Short-form video reels & single-slide micro-tips",
    summary:
      "Short-form visual series highlighting practical daily routines and micro-habits that replace overwork with calm efficiency.",
    rawMetrics: {
      impressions: 32000,
      reach: 26500,
      engagements: 740,
      clicks: 310,
      conversions: 19,
    },
    keyTakeaway:
      "Short video reels achieved wide audience reach, but sustained lower engagement rates and click-through compared to educational carousels.",
  },
  {
    id: "camp-03",
    name: "The Practical Tech Guide",
    channel: "linkedin",
    status: "completed",
    dateRange: {
      start: "2026-09-10",
      end: "2026-09-24",
      label: "Sept 10 – Sept 24, 2026",
    },
    objective: "Demystify utility software, tools, and everyday productivity practices.",
    audience: "Small business owners, founders, and self-employed professionals",
    contentTheme: "Utility Software & Practical Automation",
    format: "Step-by-step guides, tool comparison cards, and workflow teardowns",
    summary:
      "Actionable breakdowns of everyday software workflows, tools, and practical automation practices for modern lean operations.",
    rawMetrics: {
      impressions: 14800,
      reach: 11500,
      engagements: 610,
      clicks: 390,
      conversions: 44,
    },
    keyTakeaway:
      "Direct, no-nonsense tool teardowns produced the highest engagement rate (5.30%) and strongest CTR (2.64%) across the sample dataset.",
  },
  {
    id: "camp-04",
    name: "Behind the Workflow",
    channel: "instagram",
    status: "active",
    dateRange: {
      start: "2026-09-22",
      end: "2026-10-06",
      label: "Sept 22 – Oct 6, 2026",
    },
    objective: "Spotlight authentic everyday user efficiency workflows and desktop setups.",
    audience: "Young professionals interested in focused environments",
    contentTheme: "Real-world Desktop Setups & Workflow Teardowns",
    format: "Behind-the-scenes carousels & user spotlight stories",
    summary:
      "Short-form visual stories showing how modern knowledge workers simplify repetitive work and organize distraction-free workspaces.",
    rawMetrics: {
      impressions: 21400,
      reach: 17800,
      engagements: 695,
      clicks: 220,
      conversions: 12,
    },
    keyTakeaway:
      "Multi-image setup carousels drove stronger engagement rates (3.90%) than short video reels, indicating visual breakdowns perform better on Instagram for Northstar.",
  },
];

/**
 * Builds the fully structured, calculated Northstar campaign dataset.
 * Derived metrics and performance signals are calculated deterministically.
 */
function buildCampaigns(): StructuredCampaign[] {
  return CAMPAIGN_DEFINITIONS.map((def) => {
    const derived = deriveCampaignMetrics(def.rawMetrics);
    const signals = derivePerformanceSignals(def.rawMetrics, derived);

    return {
      id: def.id,
      name: def.name,
      channel: def.channel,
      status: def.status,
      dateRange: def.dateRange,
      objective: def.objective,
      audience: def.audience,
      contentTheme: def.contentTheme,
      format: def.format,
      summary: def.summary,
      performance: {
        raw: def.rawMetrics,
        derived,
        signals,
        isSynthetic: true,
        disclaimer: SYNTHETIC_DATA_DISCLAIMER,
      },
      keyTakeaway: def.keyTakeaway,
    };
  });
}

export const NORTHSTAR_CAMPAIGNS: StructuredCampaign[] = buildCampaigns();

/**
 * Helper to retrieve all campaigns.
 */
export function getAllCampaigns(): StructuredCampaign[] {
  return NORTHSTAR_CAMPAIGNS;
}

/**
 * Helper to retrieve a campaign by ID.
 */
export function getCampaignById(id: string): StructuredCampaign | undefined {
  return NORTHSTAR_CAMPAIGNS.find((c) => c.id === id);
}

/**
 * Filter campaigns by channel.
 */
export function getCampaignsByChannel(
  channel: "linkedin" | "instagram" | "all"
): StructuredCampaign[] {
  if (channel === "all") return NORTHSTAR_CAMPAIGNS;
  return NORTHSTAR_CAMPAIGNS.filter((c) => c.channel === channel);
}

/**
 * Filter campaigns by status.
 */
export function getCampaignsByStatus(status: string): StructuredCampaign[] {
  if (status === "all") return NORTHSTAR_CAMPAIGNS;
  return NORTHSTAR_CAMPAIGNS.filter((c) => c.status === status);
}
