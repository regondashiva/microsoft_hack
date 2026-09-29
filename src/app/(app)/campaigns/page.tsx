"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import { CreateCampaignModal } from "@/components/campaigns/create-campaign-modal";
import { useCampaigns } from "@/features/campaigns/campaign-store";
import { Campaign } from "@/types";
import { Plus, CheckCircle } from "lucide-react";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

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

export default function CampaignsPage() {
  const { campaigns, addCampaign, deleteCampaign } = useCampaigns();
  const [activeTab, setActiveTab] = React.useState("all");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [successId, setSuccessId] = React.useState<string | null>(null);

  const filtered = campaigns.filter((c) =>
    activeTab === "all" ? true : c.status === activeTab
  );

  // Recompute counts for tabs
  const tabsWithCounts: TabItem[] = [
    { id: "all", label: "All", count: campaigns.length },
    { id: "active", label: "Active", count: campaigns.filter((c) => c.status === "active").length },
    { id: "completed", label: "Completed", count: campaigns.filter((c) => c.status === "completed").length },
    { id: "draft", label: "Draft", count: campaigns.filter((c) => c.status === "draft").length },
    { id: "planned", label: "Planned", count: campaigns.filter((c) => c.status === "planned").length },
  ];

  const handleCreate = (data: Omit<Campaign, "id" | "createdAt">) => {
    const created = addCampaign(data);
    setModalOpen(false);
    setSuccessId(created.id);
    setActiveTab("all");
    // Clear success message after 4s
    setTimeout(() => setSuccessId(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Campaigns"
        description="Historical campaign archive and planning workspace for Northstar Brand Co."
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
          <span>Campaign created successfully.</span>
        </div>
      )}

      {/* Status Tabs */}
      <Tabs tabs={tabsWithCounts} activeTab={activeTab} onChange={setActiveTab} />

      {/* Campaign Table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-base font-medium text-[var(--text-primary)]">
                No campaigns in this view
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {activeTab === "all"
                  ? "Create your first campaign record to get started."
                  : "No campaigns match the selected filter."}
              </p>
              {activeTab === "all" && (
                <Button
                  variant="secondary"
                  size="md"
                  className="mt-4 gap-2"
                  onClick={() => setModalOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  New Campaign Record
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-muted)] font-mono uppercase tracking-wider text-xs">
                    <th className="py-3 px-6 font-medium">Campaign</th>
                    <th className="py-3 px-4 font-medium">Platform</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-6 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filtered.map((camp) => (
                    <tr
                      key={camp.id}
                      className={`hover:bg-[var(--surface-elevated)]/40 transition-colors ${
                        successId === camp.id
                          ? "bg-[var(--status-success-bg)]/30"
                          : ""
                      }`}
                    >
                      <td className="py-5 px-6">
                        <div className="font-medium text-base text-[var(--text-primary)]">
                          {camp.name}
                        </div>
                        <div className="text-sm text-[var(--text-muted)] mt-0.5 max-w-md leading-relaxed">
                          {camp.description}
                        </div>
                        {camp.contentObjective && (
                          <div className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                            Objective: {camp.contentObjective}
                          </div>
                        )}
                      </td>
                      <td className="py-5 px-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                        <PlatformLabel platform={camp.platform} />
                      </td>
                      <td className="py-5 px-4 whitespace-nowrap">
                        <StatusPill status={camp.status} />
                      </td>
                      <td className="py-5 px-4 text-sm text-[var(--text-muted)] whitespace-nowrap font-mono">
                        {formatDate(camp.campaignDate)}
                      </td>
                      <td className="py-5 px-6 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[var(--status-error)] hover:text-[var(--status-error)] hover:bg-[var(--status-error-bg)]"
                          onClick={() => deleteCampaign(camp.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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
