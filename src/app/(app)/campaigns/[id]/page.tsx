"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCampaignById } from "@/lib/campaigns";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BarChart2,
  CheckCircle2,
  Info,
  Layers,
  MousePointer,
  Target,
  Users,
} from "lucide-react";

export default function CampaignDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const campaign = getCampaignById(id);

  if (!campaign) {
    return (
      <div className="space-y-6 pb-12 max-w-4xl">
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>
        <Card className="border-[var(--border)]">
          <CardContent className="py-16 text-center">
            <h2 className="text-lg font-medium text-[var(--text-primary)]">
              Campaign Record Not Found
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-md mx-auto">
              No campaign record matching ID &apos;{id}&apos; was found in the Northstar dataset.
            </p>
            <div className="mt-6">
              <Link href="/campaigns">
                <Button variant="secondary" size="md">
                  View All Campaigns
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { performance, raw, derived } = {
    performance: campaign.performance,
    raw: campaign.performance.raw,
    derived: campaign.performance.derived,
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl">
      {/* Navigation */}
      <div>
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>
        <PageHeader
          title={campaign.name}
          description={campaign.summary}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)]">
                {campaign.channel === "linkedin" ? "LinkedIn" : "Instagram"}
              </span>
              <StatusPill status={campaign.status} />
              <Link
                href={`/strategist?q=${encodeURIComponent(
                  `What can we learn or build upon from the ${campaign.name} campaign?`
                )}`}
              >
                <Button size="sm" variant="outline" className="text-xs">
                  Ask Strategist About This Campaign →
                </Button>
              </Link>
            </div>
          }
        />
      </div>

      {/* Synthetic Data Disclosure Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-xs text-[var(--text-muted)] leading-relaxed">
        <Info className="h-4 w-4 text-[var(--status-info)] shrink-0 mt-0.5" />
        <div>
          <span className="font-medium text-[var(--text-primary)]">
            Synthetic Demo Performance Data:
          </span>{" "}
          All metric values, engagement calculations, and signals displayed for this campaign are
          synthetic demonstration records designed to ground AI strategist reasoning. They do not
          represent verified real-world business results or revenue.
        </div>
      </div>

      {/* Overview & Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strategic Profile */}
        <Card className="border-[var(--border)]">
          <CardContent className="p-6 space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
              <Target className="h-4 w-4 text-[var(--accent)]" />
              Strategic Profile
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs text-[var(--text-muted)] block uppercase font-mono tracking-wider">
                  Campaign Period
                </span>
                <p className="text-[var(--text-primary)] font-mono mt-0.5">
                  {campaign.dateRange.label}
                </p>
              </div>

              <div>
                <span className="text-xs text-[var(--text-muted)] block uppercase font-mono tracking-wider">
                  Content Objective
                </span>
                <p className="text-[var(--text-primary)] mt-0.5 leading-relaxed">
                  {campaign.objective}
                </p>
              </div>

              <div>
                <span className="text-xs text-[var(--text-muted)] block uppercase font-mono tracking-wider">
                  Target Audience
                </span>
                <p className="text-[var(--text-secondary)] mt-0.5 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
                  {campaign.audience}
                </p>
              </div>

              <div>
                <span className="text-xs text-[var(--text-muted)] block uppercase font-mono tracking-wider">
                  Content Theme &amp; Format
                </span>
                <p className="text-[var(--text-primary)] mt-0.5 font-medium">
                  {campaign.contentTheme}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-1">
                  <Layers className="h-3 w-3 shrink-0" />
                  {campaign.format}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dataset Observation / Takeaway */}
        <Card className="border-[var(--border)]">
          <CardContent className="p-6 space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--status-success)]" />
              Demo Dataset Takeaway
            </h3>

            <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/60 p-4">
              <p className="text-sm text-[var(--text-primary)] leading-relaxed italic">
                &ldquo;{campaign.keyTakeaway}&rdquo;
              </p>
              <div className="mt-3 text-xs text-[var(--text-muted)] font-mono">
                Context Source: Sample Campaign Dataset (Northstar Historical Baseline)
              </div>
            </div>

            <div>
              <span className="text-xs text-[var(--text-muted)] block uppercase font-mono tracking-wider mb-2">
                Derived Performance Signals
              </span>
              <div className="flex flex-wrap gap-2">
                {performance.signals.map((signal) => (
                  <span
                    key={signal.type}
                    className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    title={signal.description}
                  >
                    {signal.label}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-[var(--accent)]" />
              Performance Metrics
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Deterministic calculations derived from synthetic demonstration records
            </p>
          </div>
          <span className="text-xs font-mono text-[var(--text-muted)] border border-[var(--border)] rounded px-2 py-0.5 bg-[var(--surface-subtle)]">
            SYNTHETIC DATA
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Impressions */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
            <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">
              Impressions
            </div>
            <div className="text-2xl font-semibold text-[var(--text-primary)] mt-1 font-mono">
              {raw.impressions.toLocaleString()}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Total ad/post views</div>
          </div>

          {/* Reach */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
            <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">
              Reach
            </div>
            <div className="text-2xl font-semibold text-[var(--text-primary)] mt-1 font-mono">
              {raw.reach.toLocaleString()}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Unique accounts</div>
          </div>

          {/* Engagement Rate */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
            <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">
              Engagement Rate
            </div>
            <div className="text-2xl font-semibold text-[var(--accent)] mt-1 font-mono">
              {derived.engagementRate}%
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1 font-mono">
              {raw.engagements.toLocaleString()} engagements
            </div>
          </div>

          {/* Click-Through Rate */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
            <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">
              CTR
            </div>
            <div className="text-2xl font-semibold text-[var(--status-success)] mt-1 font-mono">
              {derived.clickThroughRate}%
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1 font-mono">
              {raw.clicks.toLocaleString()} clicks
            </div>
          </div>
        </div>

        {/* Extended Metrics if conversions present */}
        {raw.conversions !== undefined && derived.conversionRate !== undefined && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">
                  Demo Conversions
                </div>
                <div className="text-xl font-semibold text-[var(--text-primary)] mt-0.5 font-mono">
                  {raw.conversions} actions
                </div>
              </div>
              <MousePointer className="h-6 w-6 text-[var(--text-muted)]" />
            </div>

            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">
                  Conversion Rate (Conversions / Clicks)
                </div>
                <div className="text-xl font-semibold text-[var(--text-primary)] mt-0.5 font-mono">
                  {derived.conversionRate}%
                </div>
              </div>
              <Target className="h-6 w-6 text-[var(--text-muted)]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
