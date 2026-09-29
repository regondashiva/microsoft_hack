"use client";

import * as React from "react";
import Link from "next/link";
import { Campaign } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { ArrowRight, Layers } from "lucide-react";

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
  return (
    <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)]">
      {labels[platform] ?? platform}
    </span>
  );
}

interface RecentCampaignsSectionProps {
  campaigns: Campaign[];
}

export function RecentCampaignsSection({ campaigns }: RecentCampaignsSectionProps) {
  const displayCampaigns = campaigns.slice(0, 4);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Layers className="h-4 w-4 text-[var(--accent)]" />
            Recent Campaigns &amp; Initiatives
          </CardTitle>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Active and completed marketing initiatives recorded in the Northstar dataset
          </p>
        </div>
        <Link
          href="/campaigns"
          className="text-xs font-mono text-[var(--accent)] hover:underline inline-flex items-center gap-1"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-muted)] font-mono uppercase tracking-wider text-xs">
                <th className="py-3 px-6 font-medium">Campaign</th>
                <th className="py-3 px-4 font-medium">Channel</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-6 font-medium text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {displayCampaigns.map((camp) => (
                <tr
                  key={camp.id}
                  className="hover:bg-[var(--surface-elevated)]/40 transition-colors"
                >
                  <td className="py-4 px-6 max-w-md">
                    <Link
                      href={`/campaigns/${camp.id}`}
                      className="font-medium text-sm sm:text-base text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span>{camp.name}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent)]" />
                    </Link>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed line-clamp-2">
                      {camp.description}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <PlatformLabel platform={camp.platform} />
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <StatusPill status={camp.status} />
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <Link
                      href={`/campaigns/${camp.id}`}
                      className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Inspect &rarr;
                    </Link>
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
