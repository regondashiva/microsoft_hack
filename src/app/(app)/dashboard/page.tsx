"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { BrandContextSection } from "@/components/dashboard/brand-context-section";
import { RecentCampaignsSection } from "@/components/dashboard/recent-campaigns-section";
import { AudienceContextSection } from "@/components/dashboard/audience-context-section";
import { ContentDirectionSection } from "@/components/dashboard/content-direction-section";
import { useCampaigns } from "@/features/campaigns/campaign-store";
import { Button } from "@/components/ui/button";
import { Brand } from "@/types";
import {
  Sparkles,
  Layers,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users2,
} from "lucide-react";

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
  primaryAudience: "Young professionals (22–34)",
  contentPreference: "Practical, educational, and concise",
  preferredTone: "Clear, confident, and approachable",
  avoidApproach: "Overly promotional messaging or unverified claims",
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
    <div className="space-y-8 pb-16">
      {/* Product Overview Header */}
      <PageHeader
        title="Strategy Overview"
        description="A unified working view of Northstar's brand identity, target audiences, campaign records, and content direction."
        actions={
          <Link href="/strategist">
            <Button variant="primary" size="md" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Ask Strategist
            </Button>
          </Link>
        }
      />

      {/* Hero Explainer Banner: What MemoryAI Does */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-4">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[var(--accent)] uppercase tracking-wider">
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>MemoryAI Cognitive System</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Content strategy grounded in persistent memory, not transient prompts.
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            MemoryAI integrates Northstar&apos;s verified brand positioning, audience preferences, historical campaign signals, and user-taught strategic corrections into every recommendation. As you guide the strategist, it retains feedback and refines future outputs.
          </p>
        </div>

        {/* Quick Nav Workflow Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--border-subtle)]">
          <Link href="/strategist">
            <Button variant="primary" size="sm" className="gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Formulate Strategy
            </Button>
          </Link>
          <Link href="/campaigns">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <Layers className="h-3.5 w-3.5" />
              Inspect Campaigns
            </Button>
          </Link>
          <Link href="/audience">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <Users2 className="h-3.5 w-3.5" />
              Audience Segments
            </Button>
          </Link>
          <Link href="/memory">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
              <BrainCircuit className="h-3.5 w-3.5 text-[var(--accent)]" />
              Explore Memory Bank
            </Button>
          </Link>
        </div>
      </div>

      {/* Operational Strategic Footprint (Factual baseline, no fake percentages) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Persistent Memory
          </div>
          <div className="text-xl sm:text-2xl font-semibold font-mono text-[var(--text-primary)] mt-1 flex items-center gap-2">
            <span>19 Units</span>
            <ShieldCheck className="h-4 w-4 text-[var(--status-success)]" />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Hindsight Cloud Memory Bank</p>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Tracked Campaigns
          </div>
          <div className="text-xl sm:text-2xl font-semibold font-mono text-[var(--text-primary)] mt-1">
            {campaigns.length} Initiatives
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">LinkedIn &amp; Instagram Records</p>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Core Audiences
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mt-1 truncate">
            2 Segments
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Young Pros &amp; Small Business</p>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Brand Archetype
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-[var(--accent)] mt-1 truncate">
            Practical Guide
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Evidence-Aware &amp; Actionable</p>
        </div>
      </div>

      {/* Brand Context */}
      <section>
        <BrandContextSection brand={northstarBrand} />
      </section>

      {/* Recent Campaigns */}
      <section>
        <RecentCampaignsSection campaigns={campaigns} />
      </section>

      {/* Audience & Content Direction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <section>
          <AudienceContextSection audience={audienceContext} />
        </section>
        <section>
          <ContentDirectionSection direction={contentDirection} />
        </section>
      </div>

      {/* Workflow Navigation Callout */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[var(--status-success)]" />
            Ready to formulate content direction?
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Ask the AI Content Strategist to synthesize recommendations grounded in these records.
          </p>
        </div>
        <Link href="/strategist" className="shrink-0">
          <Button variant="primary" size="md" className="gap-2 w-full sm:w-auto">
            <span>Open Strategist</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
