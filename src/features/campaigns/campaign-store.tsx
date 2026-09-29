"use client";

import * as React from "react";
import { Campaign } from "@/types";

export const initialNorthstarCampaigns: Campaign[] = [
  {
    id: "camp-01",
    name: "Productivity Without the Noise",
    description:
      "Educational campaign focused on practical productivity workflows and reducing digital distractions.",
    platform: "linkedin",
    status: "completed",
    campaignDate: "2026-09-10",
    contentObjective: "Help professionals reduce notification clutter and streamline daily tools.",
    targetAudience: "Young professionals and team leads",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "camp-02",
    name: "Work Smarter, Not Louder",
    description:
      "Short-form content exploring practical ways professionals can improve everyday workflows.",
    platform: "instagram",
    status: "active",
    campaignDate: "2026-09-20",
    contentObjective: "Engage audience with bite-sized daily workflow improvements.",
    targetAudience: "Digitally engaged knowledge workers",
    createdAt: "2026-09-18T00:00:00Z",
  },
  {
    id: "camp-03",
    name: "The Practical Tech Guide",
    description:
      "Actionable breakdowns of everyday software workflows, tools and productivity practices.",
    platform: "linkedin",
    status: "draft",
    campaignDate: "2026-10-05",
    contentObjective: "Demystify utility software and everyday automation.",
    targetAudience: "Small business owners and self-employed professionals",
    createdAt: "2026-09-27T00:00:00Z",
  },
  {
    id: "camp-04",
    name: "Behind the Workflow",
    description:
      "Short-form stories showing how people simplify repetitive work with practical technology.",
    platform: "instagram",
    status: "planned",
    campaignDate: "2026-10-15",
    contentObjective: "Spotlight authentic everyday user efficiency workflows.",
    targetAudience: "Young professionals",
    createdAt: "2026-09-28T00:00:00Z",
  },
];

interface CampaignContextValue {
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, "id" | "createdAt">) => Campaign;
  deleteCampaign: (id: string) => void;
  getCampaign: (id: string) => Campaign | undefined;
}

const CampaignContext = React.createContext<CampaignContextValue | undefined>(undefined);

const STORAGE_KEY = "memoryai_northstar_campaigns_v1";

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer: hydrate from localStorage on first render (client-only)
  const [campaigns, setCampaigns] = React.useState<Campaign[]>(() => {
    if (typeof window === "undefined") return initialNorthstarCampaigns;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Campaign[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fall through to seeds
    }
    return initialNorthstarCampaigns;
  });
  const isLoaded = true; // Hydration handled by lazy initializer

  // Save changes to localStorage after initial hydration
  React.useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
      } catch {
        // Handle private browsing or quota limits gracefully
      }
    }
  }, [campaigns, isLoaded]);

  const addCampaign = React.useCallback(
    (input: Omit<Campaign, "id" | "createdAt">): Campaign => {
      const newCampaign: Campaign = {
        ...input,
        id: `camp-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setCampaigns((prev) => [newCampaign, ...prev]);
      return newCampaign;
    },
    []
  );

  const deleteCampaign = React.useCallback((id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getCampaign = React.useCallback(
    (id: string) => campaigns.find((c) => c.id === id),
    [campaigns]
  );

  return (
    <CampaignContext.Provider
      value={{ campaigns, addCampaign, deleteCampaign, getCampaign }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns() {
  const context = React.useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaigns must be used within a CampaignProvider");
  }
  return context;
}
