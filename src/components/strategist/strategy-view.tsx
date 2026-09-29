import * as React from "react";
import { StrategyResponse } from "@/lib/strategist/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Compass, Lightbulb, ShieldAlert, CheckCircle2, Bookmark, BarChart } from "lucide-react";
import { RecommendationFeedback } from "./recommendation-feedback";
import { ExplainabilityView } from "./explainability-view";

interface StrategyViewProps {
  strategy: StrategyResponse;
  query: string;
}

export function StrategyView({ strategy, query }: StrategyViewProps) {
  const explanation = strategy.explanation;

  return (
    <div className="space-y-6">
      {/* 1. Strategic Overview Summary Card */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader className="pb-3 border-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[var(--accent)]">
              <Compass className="h-4 w-4" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">
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

      {/* 2. Recommended Direction Cards with Recommendation-Level Explanations */}
      {strategy.recommendations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--text-primary)]">
              <Lightbulb className="h-4 w-4 text-[var(--accent)]" />
              <h3 className="text-base font-semibold">Recommended Direction</h3>
            </div>
            {explanation && (
              <span className="text-xs text-[var(--text-muted)] font-mono">
                {strategy.recommendations.length} action points
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategy.recommendations.map((rec, index) => {
              const recExplanation = explanation?.recommendationExplanations?.[index];

              return (
                <Card
                  key={rec.title || index}
                  className="bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)] transition-colors flex flex-col justify-between"
                >
                  <div>
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
                    <CardContent className="p-5 pt-0 space-y-3">
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pl-7">
                        {rec.description}
                      </p>

                      {/* Recommendation-Level Strategic Connection */}
                      {recExplanation && (
                        <div className="ml-7 mt-3 p-2.5 rounded-md bg-[var(--surface-subtle)]/70 border border-[var(--border-subtle)] space-y-1.5 text-[11px]">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold flex items-center gap-1">
                            <span>Strategic Basis</span>
                          </div>
                          <p className="text-[var(--text-secondary)] leading-relaxed">
                            {recExplanation.strategicConnection}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {recExplanation.supportingMemories.map((m) => (
                              <span
                                key={m}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-[10px] font-mono text-[var(--text-secondary)]"
                              >
                                <Bookmark className="h-2.5 w-2.5 text-[var(--accent)]" />
                                {m}
                              </span>
                            ))}
                            {recExplanation.supportingCampaigns.map((c) => (
                              <span
                                key={c}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[10px] font-mono text-[var(--accent)]"
                              >
                                <BarChart className="h-2.5 w-2.5" />
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Strategic Reasoning: Why This Fits Northstar */}
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

      {/* 4. Complete Explainability & Evidence Flow Section */}
      {explanation && <ExplainabilityView explanation={explanation} />}

      {/* 5. Strategic Recommendation Feedback & Controlled Teaching Loop */}
      <RecommendationFeedback query={query} summary={strategy.summary} />

      {/* 6. Strategic Guardrails & Caveats (Only rendered if non-empty) */}
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
