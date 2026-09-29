"use client";

import * as React from "react";
import Link from "next/link";
import { StrategyExplanation, MemoryEvidenceItem } from "@/lib/strategist/explainability/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Database,
  BarChart2,
  GitCommit,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink,
  ArrowDown,
} from "lucide-react";

interface ExplainabilityViewProps {
  explanation: StrategyExplanation;
}

export function ExplainabilityView({ explanation }: ExplainabilityViewProps) {
  const [isDetailsExpanded, setIsDetailsExpanded] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"chain" | "memories" | "campaigns">("chain");

  const {
    evidenceCounts,
    memoryEvidence,
    campaignEvidence,
    strategicConnection,
    visualFlow,
    missingEvidence,
  } = explanation;

  const renderProvenanceBadge = (item: MemoryEvidenceItem) => {
    switch (item.source) {
      case "user_taught":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Source: User Taught
          </span>
        );
      case "user_feedback":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Source: User Feedback
          </span>
        );
      case "campaign_history":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Source: Campaign History
          </span>
        );
      case "seeded":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
            Source: Seeded Brand Knowledge
          </span>
        );
    }
  };

  return (
    <Card className="border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Evidence Summary Header */}
      <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <GitCommit className="h-4 w-4 text-[var(--accent)]" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--text-muted)]">
                Explainability &amp; Evidence Grounding
              </span>
            </div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              Evidence Used:
              <span className="text-sm font-normal font-mono px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]">
                {evidenceCounts.label}
              </span>
            </CardTitle>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View switcher tabs */}
            <div className="flex rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("chain");
                  setIsDetailsExpanded(true);
                }}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeTab === "chain" && isDetailsExpanded
                    ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                Evidence Chain
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("memories");
                  setIsDetailsExpanded(true);
                }}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeTab === "memories" && isDetailsExpanded
                    ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                Memories ({memoryEvidence.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("campaigns");
                  setIsDetailsExpanded(true);
                }}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeTab === "campaigns" && isDetailsExpanded
                    ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                Campaigns ({campaignEvidence.length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsDetailsExpanded((prev) => !prev)}
              className="p-1.5 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
              aria-label={isDetailsExpanded ? "Collapse evidence section" : "Expand evidence section"}
            >
              {isDetailsExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* High-Level Strategic Connection */}
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-2">
          {strategicConnection}
        </p>
      </CardHeader>

      {isDetailsExpanded && (
        <CardContent className="p-5 space-y-6">
          {/* TAB 1: VISUAL EVIDENCE FLOW CHAIN */}
          {activeTab === "chain" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  Visual Evidence Flow
                </span>
                <span className="text-[11px] text-[var(--text-muted)] italic">
                  How memory and campaign context shaped the recommendation
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
                {visualFlow.map((step, idx) => (
                  <div
                    key={step.step}
                    className="relative flex flex-col justify-between p-3.5 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]/70 hover:border-[var(--border-strong)] transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--accent)] font-semibold">
                          {step.badge}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          Step {idx + 1}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-[var(--text-primary)]">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                        {step.detail}
                      </p>
                    </div>

                    {/* Step indicator arrow for mobile or subtext */}
                    {idx < visualFlow.length - 1 && (
                      <div className="md:hidden flex justify-center py-1 text-[var(--text-muted)]">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SUPPORTING MEMORY EVIDENCE */}
          {activeTab === "memories" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-[var(--accent)]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Supporting Brand Memory ({memoryEvidence.length})
                  </span>
                </div>
                <Link
                  href="/memory"
                  className="text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-medium"
                >
                  Inspect Memory Bank <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              {missingEvidence.hasMissingMemory ? (
                <div className="p-4 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-subtle)]/30 text-xs text-[var(--text-muted)] text-center">
                  {missingEvidence.memoryNote}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {memoryEvidence.map((mem) => (
                    <div
                      key={mem.id}
                      className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]/60 space-y-2 hover:border-[var(--border-strong)] transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {renderProvenanceBadge(mem)}
                          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">
                            [{mem.category}]
                          </span>
                        </div>
                        {mem.context && (
                          <span className="text-[10px] font-mono text-[var(--text-muted)] truncate max-w-[140px]">
                            {mem.context}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-primary)] leading-relaxed font-normal">
                        &ldquo;{mem.content}&rdquo;
                      </p>
                      <div className="pt-1 text-[10px] font-mono text-[var(--text-muted)]">
                        Citation: {mem.citationLabel}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RELEVANT CAMPAIGN EVIDENCE */}
          {activeTab === "campaigns" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-[var(--accent)]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Relevant Campaign Evidence ({campaignEvidence.length})
                  </span>
                </div>
                <Link
                  href="/campaigns"
                  className="text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-medium"
                >
                  All Campaigns <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              {missingEvidence.hasMissingCampaign ? (
                <div className="p-4 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-subtle)]/30 text-xs text-[var(--text-muted)] text-center">
                  {missingEvidence.campaignNote}
                </div>
              ) : (
                <div className="space-y-3">
                  {campaignEvidence.map((camp) => (
                    <div
                      key={camp.id}
                      className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]/60 space-y-3 hover:border-[var(--border-strong)] transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[var(--text-primary)]">
                            {camp.name}
                          </span>
                          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)]">
                            {camp.channel === "linkedin" ? "LinkedIn" : "Instagram"}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)]">
                            {camp.status}
                          </span>
                        </div>
                        <Link
                          href={`/campaigns/${camp.id}`}
                          className="text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          View Details →
                        </Link>
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
                        Takeaway: &ldquo;{camp.keyTakeaway}&rdquo;
                      </p>

                      {/* Deterministic Metrics Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-[var(--border-subtle)] text-xs">
                        <div className="p-2 rounded bg-[var(--surface-elevated)]/60">
                          <span className="text-[10px] text-[var(--text-muted)] block font-mono">
                            Reach
                          </span>
                          <span className="font-mono font-medium text-[var(--text-primary)]">
                            {camp.reach.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-[var(--surface-elevated)]/60">
                          <span className="text-[10px] text-[var(--text-muted)] block font-mono">
                            Engagement Rate
                          </span>
                          <span className="font-mono font-medium text-[var(--accent)]">
                            {camp.engagementRate}%
                          </span>
                        </div>
                        <div className="p-2 rounded bg-[var(--surface-elevated)]/60">
                          <span className="text-[10px] text-[var(--text-muted)] block font-mono">
                            CTR
                          </span>
                          <span className="font-mono font-medium text-[var(--status-success)]">
                            {camp.clickThroughRate}%
                          </span>
                        </div>
                        <div className="p-2 rounded bg-[var(--surface-elevated)]/60">
                          <span className="text-[10px] text-[var(--text-muted)] block font-mono">
                            Format
                          </span>
                          <span className="font-medium text-[var(--text-secondary)] truncate block">
                            {camp.format}
                          </span>
                        </div>
                      </div>

                      {/* Synthetic Disclosure */}
                      <div className="flex items-start gap-1.5 text-[11px] text-[var(--text-muted)] bg-[var(--surface-elevated)]/40 p-2 rounded border border-[var(--border-subtle)]">
                        <Info className="h-3 w-3 shrink-0 mt-0.5 text-[var(--status-info)]" />
                        <span>{camp.disclaimer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
