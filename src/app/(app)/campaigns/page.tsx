"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import { CreateCampaignModal } from "@/components/campaigns/create-campaign-modal";
import { useCampaigns } from "@/features/campaigns/campaign-store";
import { Campaign } from "@/types";
import {
  getAllCampaigns,
  calculateCampaignInsights,
  StructuredCampaign,
} from "@/lib/campaigns";
import {
  Plus,
  CheckCircle,
  Info,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function CampaignsPage() {
  const { addCampaign } = useCampaigns();
  const [activeTab, setActiveTab] = React.useState("all");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [successId, setSuccessId] = React.useState<string | null>(null);

  const structuredCampaigns = React.useMemo(() => getAllCampaigns(), []);
  const insights = React.useMemo(() => calculateCampaignInsights(structuredCampaigns), [structuredCampaigns]);

  // Tab filtering logic
  const filteredCampaigns = React.useMemo(() => {
    return structuredCampaigns.filter((c: StructuredCampaign) => {
      if (activeTab === "all") return true;
      if (activeTab === "active" || activeTab === "completed" || activeTab === "draft" || activeTab === "planned") {
        return c.status === activeTab;
      }
      if (activeTab === "linkedin" || activeTab === "instagram") {
        return c.channel === activeTab;
      }
      return true;
    });
  }, [structuredCampaigns, activeTab]);

  const tabsWithCounts: TabItem[] = [
    { id: "all", label: "All Campaigns", count: structuredCampaigns.length },
    { id: "linkedin", label: "LinkedIn", count: structuredCampaigns.filter((c) => c.channel === "linkedin").length },
    { id: "instagram", label: "Instagram", count: structuredCampaigns.filter((c) => c.channel === "instagram").length },
    { id: "active", label: "Active", count: structuredCampaigns.filter((c) => c.status === "active").length },
    { id: "completed", label: "Completed", count: structuredCampaigns.filter((c) => c.status === "completed").length },
  ];

  const handleCreate = (data: Omit<Campaign, "id" | "createdAt">) => {
    const created = addCampaign(data);
    setModalOpen(false);
    setSuccessId(created.id);
    setActiveTab("all");
    setTimeout(() => setSuccessId(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Campaign Intelligence"
        description="Structured campaign records, synthetic performance signals, and channel dynamics for Northstar Brand Co."
        actions={
          <Button
            variant="primary"
            size="md"
            className="gap-2"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New Campaign Record
          </Button>
        }
      />

      {/* Success Banner */}
      {successId && (
        <div className="flex items-center gap-2.5 rounded-lg border border-[var(--status-success-border)] bg-[var(--status-success-bg)] px-4 py-3 text-sm text-[var(--status-success)]">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Campaign record created successfully.</span>
        </div>
      )}

      {/* Synthetic Demo Data Disclosure Banner */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 text-[var(--status-info)] shrink-0" />
          <span>
            <strong className="text-[var(--text-primary)] font-medium">
              Synthetic demo data — used to demonstrate campaign intelligence.
            </strong>{" "}
            Metrics illustrate product reasoning and do not reflect real business revenue or financial performance.
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] border border-[var(--border)] rounded px-1.5 py-0.5 shrink-0 hidden sm:inline">
          DEMO DATASET
        </span>
      </div>

      {/* Status / Channel Tabs */}
      <Tabs tabs={tabsWithCounts} activeTab={activeTab} onChange={setActiveTab} />

      {/* Campaign Table */}
      <Card>
        <CardContent className="p-0">
          {filteredCampaigns.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-base font-medium text-[var(--text-primary)]">
                No campaigns match this filter
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Select another view or add a new campaign record.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-muted)] font-mono uppercase tracking-wider text-xs">
                    <th className="py-3 px-6 font-medium">Campaign &amp; Theme</th>
                    <th className="py-3 px-4 font-medium">Channel</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Period</th>
                    <th className="py-3 px-4 font-medium">Performance (Demo)</th>
                    <th className="py-3 px-6 font-medium text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredCampaigns.map((camp) => {
                    const derived = camp.performance.derived;
                    const raw = camp.performance.raw;
                    return (
                      <tr
                        key={camp.id}
                        className="hover:bg-[var(--surface-elevated)]/40 transition-colors"
                      >
                        <td className="py-4 px-6 max-w-sm">
                          <Link
                            href={`/campaigns/${camp.id}`}
                            className="font-medium text-base text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1.5 group"
                          >
                            <span>{camp.name}</span>
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent)]" />
                          </Link>
                          <div className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">
                            {camp.summary}
                          </div>
                          <div className="text-[11px] text-[var(--text-secondary)] mt-1 font-mono">
                            Theme: {camp.contentTheme}
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm">
                          <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)]">
                            {camp.channel === "linkedin" ? "LinkedIn" : "Instagram"}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <StatusPill status={camp.status} />
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-[var(--text-muted)] font-mono">
                          {camp.dateRange.label}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-xs">
                          <div className="font-mono text-[var(--text-primary)]">
                            <span className="font-semibold text-[var(--accent)]">{derived.engagementRate}%</span> ER &middot;{" "}
                            <span className="font-semibold text-[var(--status-success)]">{derived.clickThroughRate}%</span> CTR
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] mt-0.5 font-mono">
                            {raw.reach.toLocaleString()} reach &middot; {raw.clicks.toLocaleString()} clicks
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-right">
                          <Link href={`/campaigns/${camp.id}`}>
                            <Button variant="ghost" size="sm" className="text-xs font-mono">
                              View Performance
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Intelligence Observations */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
          <TrendingUp className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span>Demo Dataset Observations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.slice(0, 2).map((ins) => (
            <div
              key={ins.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)]/50 p-4 space-y-1.5"
            >
              <div className="text-xs font-medium text-[var(--text-primary)] flex items-center justify-between">
                <span>{ins.title}</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                  {ins.channel ? ins.channel : "Channel Dynamics"}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {ins.observation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <CreateCampaignModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}
