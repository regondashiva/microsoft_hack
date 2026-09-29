import * as React from "react";
import Link from "next/link";
import { StrategyResponse } from "@/lib/strategist/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Compass, Lightbulb, ShieldAlert, Database, CheckCircle2, BarChart2, Info } from "lucide-react";
import { RecommendationFeedback } from "./recommendation-feedback";

interface StrategyViewProps {
  strategy: StrategyResponse;
  query: string;
}

export function StrategyView({ strategy, query }: StrategyViewProps) {
  // Check if any campaign memories were utilized
  const campaignMemories = strategy.memoryUsed.filter((mem) =>
    mem.toUpperCase().includes("CAMPAIGN")
  );
  const nonCampaignMemories = strategy.memoryUsed.filter(
    (mem) => !mem.toUpperCase().includes("CAMPAIGN")
  );

  return (
    <div className="space-y-6">
      {/* Overview / Summary Card */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader className="pb-3 border-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[var(--accent)]">
              <Compass className="h-4 w-4" />
              <span className="text-xs font-mono uppercase tracking-wider font-medium">
                Strategy Formulation
              </span>
            </div>
            <span className="text-xs text-[var(--text-muted)] italic truncate max-w-md">
              Query: &quot;{query}&quot;
            </span>
          </div>
          <CardTitle className="text-lg sm:text-xl mt-1">Strategic Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-base text-[var(--text-primary)] leading-relaxed">
            {strategy.summary}
          </p>
        </CardContent>
      </Card>

      {/* Recommended Direction Cards */}
      {strategy.recommendations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <Lightbulb className="h-4 w-4 text-[var(--accent)]" />
            <h3 className="text-base font-semibold">Recommended Direction</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategy.recommendations.map((rec, index) => (
              <Card
                key={rec.title || index}
                className="bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
              >
                <CardHeader className="p-5 pb-2 border-none">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-medium items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <CardTitle className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                      {rec.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pl-7">
                    {rec.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Reasoning & Fit */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader className="pb-3 border-none">
          <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <CheckCircle2 className="h-4 w-4 text-[var(--status-success)]" />
            <CardTitle className="text-base">Why This Fits Northstar</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {strategy.reasoning}
          </p>
        </CardContent>
      </Card>

      {/* Relevant Campaign Context (Rendered only when campaign memory is relevant) */}
      {campaignMemories.length > 0 && (
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="pb-3 border-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <BarChart2 className="h-4 w-4 text-[var(--accent)]" />
                <CardTitle className="text-base">Relevant Campaign Context</CardTitle>
              </div>
              <Link
                href="/campaigns"
                className="text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-medium"
              >
                Inspect Campaign Records →
              </Link>
            </div>
            <div className="flex items-start gap-2 mt-1 text-xs text-[var(--text-muted)] bg-[var(--surface-subtle)] p-2.5 rounded border border-[var(--border)]">
              <Info className="h-3.5 w-3.5 text-[var(--status-info)] shrink-0 mt-0.5" />
              <span>
                Performance shown here is from synthetic demonstration data. Northstar uses historical benchmarks to guide format and messaging choices without inventing real-world metrics.
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {campaignMemories.map((mem) => (
                <span
                  key={mem}
                  className="inline-flex items-center text-xs px-2.5 py-1 rounded-md border border-[var(--accent)]/30 bg-[var(--accent)]/5 text-[var(--accent)] font-mono"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] mr-1.5 shrink-0" />
                  {mem}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategic Recommendation Feedback & Controlled Teaching Loop */}
      <RecommendationFeedback query={query} summary={strategy.summary} />

      {/* Verified Memory Context Used */}
      {strategy.memoryUsed.length > 0 && (
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader className="pb-3 border-none">
            <div className="flex items-center gap-2 text-[var(--text-primary)]">
              <Database className="h-4 w-4 text-[var(--accent)]" />
              <CardTitle className="text-sm">Verified Memory Context Used</CardTitle>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              This recommendation is grounded in the following persistent knowledge records from the Northstar Content Strategist memory bank:
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {(nonCampaignMemories.length > 0 ? nonCampaignMemories : strategy.memoryUsed).map((mem) => (
                <span
                  key={mem}
                  className="inline-flex items-center text-xs px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-secondary)] font-mono"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] mr-1.5 shrink-0" />
                  {mem}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategic Guardrails & Caveats (Only rendered if non-empty) */}
      {strategy.caveats.length > 0 && (
        <Card className="border-[var(--status-warning-border)] bg-[var(--status-warning-bg)]/40">
          <CardHeader className="pb-2 border-none">
            <div className="flex items-center gap-2 text-[var(--status-warning)]">
              <ShieldAlert className="h-4 w-4" />
              <CardTitle className="text-sm font-semibold">
                Strategic Guardrails &amp; Caveats
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1.5 text-xs text-[var(--text-secondary)] list-disc pl-5">
              {strategy.caveats.map((caveat, index) => (
                <li key={index} className="leading-relaxed">
                  {caveat}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
