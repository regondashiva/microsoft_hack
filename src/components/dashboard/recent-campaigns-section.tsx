"use client";

import * as React from "react";
import { Campaign } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";

function PlatformLabel({ platform }: { platform: string }) {
  const labels: Record<string, string> = {
    linkedin: "LinkedIn",
    instagram: "Instagram",
    x: "X",
    youtube: "YouTube",
    website: "Website",
    email: "Email",
    cross_platform: "Cross-platform",
  };
  return <span>{labels[platform] ?? platform}</span>;
}

interface RecentCampaignsSectionProps {
  campaigns: Campaign[];
}

export function RecentCampaignsSection({ campaigns }: RecentCampaignsSectionProps) {
  const displayCampaigns = campaigns.slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Campaigns</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-muted)] font-mono uppercase tracking-wider text-xs">
                <th className="py-3 px-6 font-medium">Campaign</th>
                <th className="py-3 px-4 font-medium">Platform</th>
                <th className="py-3 px-6 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {displayCampaigns.map((camp) => (
                <tr
                  key={camp.id}
                  className="hover:bg-[var(--surface-elevated)]/40 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-base text-[var(--text-primary)]">
                      {camp.name}
                    </div>
                    <div className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5 max-w-xl leading-relaxed">
                      {camp.description}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                    <PlatformLabel platform={camp.platform} />
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <StatusPill status={camp.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
