"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { StrategistForm } from "./strategist-form";
import { StrategyView } from "./strategy-view";
import { TeachMemoryModal } from "./teach-memory-modal";
import { StrategyResponse, StrategistApiResponse } from "@/lib/strategist/types";
import { AlertCircle, Compass, BookmarkPlus, ArrowRight, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const STARTER_PROMPTS = [
  {
    title: "Next Content Recommendations",
    prompt: "What should Northstar post next?",
    category: "General Strategy",
  },
  {
    title: "Audience-Focused Direction",
    prompt: "What should we post for young professionals?",
    category: "Audience Target",
  },
  {
    title: "Historical Campaign Intelligence",
    prompt: "What worked in our previous LinkedIn campaigns?",
    category: "Campaign Learning",
  },
  {
    title: "Experimental Testing",
    prompt: "What should we test next?",
    category: "Optimization",
  },
];

export function StrategistWorkspace() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";

  const [query, setQuery] = React.useState(initialQuery);
  const [activeQuery, setActiveQuery] = React.useState("");
  const [strategy, setStrategy] = React.useState<StrategyResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isTeachModalOpen, setIsTeachModalOpen] = React.useState(false);

  const handleSubmit = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setActiveQuery(trimmed);

    try {
      const res = await fetch("/api/strategist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = (await res.json()) as StrategistApiResponse;

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Strategy formulation failed.");
      }

      if (data.strategy) {
        setStrategy(data.strategy);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Strategy formulation could not be completed. Please check service connectivity and try again.";
      setErrorMessage(message);
      setStrategy(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Query Formulation Input */}
      <section className="space-y-3">
        <StrategistForm
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {/* Action bar for controlled teaching */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs">
          <span className="text-[var(--text-muted)]">
            Continuous Learning Loop: Teach Northstar new rules or campaign preferences directly into persistent memory.
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsTeachModalOpen(true)}
            className="gap-1.5 h-7 text-xs self-start sm:self-auto font-medium"
          >
            <BookmarkPlus className="h-3.5 w-3.5 text-[var(--accent)]" />
            Teach Northstar
          </Button>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="py-16 text-center rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)]/40 px-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] mb-3">
            <Compass className="h-6 w-6 animate-spin" />
          </div>
          <p className="text-base font-medium text-[var(--text-primary)]">
            Building a strategy from Northstar&apos;s brand context, memory, and relevant campaign data...
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1.5 max-w-md mx-auto">
            Retrieving verified memory from Hindsight, applying context budgeting, and synthesizing strategic recommendations with LLM reasoning.
          </p>
        </div>
      )}

      {/* Error State with Recovery Action */}
      {!isLoading && errorMessage && (
        <div className="flex flex-col gap-4 p-5 rounded-xl border border-[var(--status-error-border)] bg-[var(--status-error-bg)] text-[var(--status-error)] text-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-base">Strategy Formulation Unavailable</p>
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                {errorMessage}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-[var(--status-error-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSubmit(activeQuery || query)}
              className="gap-1.5 text-xs border-[var(--status-error-border)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try Again
            </Button>
            <span className="text-xs text-[var(--text-muted)]">
              Verify your query or check service credentials if the issue persists.
            </span>
          </div>
        </div>
      )}

      {/* Empty State before any query */}
      {!isLoading && !strategy && !errorMessage && (
        <section className="space-y-6 pt-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)]/40 p-8 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--accent)] mb-3">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Ask Northstar&apos;s strategist what to create, test, or improve
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 max-w-xl mx-auto leading-relaxed">
              Every recommendation is grounded in Northstar Brand Co.&apos;s persistent memory bank, audience guidelines, and historical campaign records. Select a starting question below or formulate your own.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-left">
              {STARTER_PROMPTS.map((starter) => (
                <button
                  key={starter.prompt}
                  type="button"
                  onClick={() => {
                    setQuery(starter.prompt);
                    handleSubmit(starter.prompt);
                  }}
                  className="group p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface-elevated)] transition-all text-left flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      {starter.category}
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      &quot;{starter.prompt}&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] mt-3 font-medium">
                    <span>Ask strategist</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Formulated Strategy Output */}
      {!isLoading && strategy && (
        <section>
          <StrategyView strategy={strategy} query={activeQuery} />
        </section>
      )}

      {/* Explicit Teach Modal with Confirmation Preview */}
      <TeachMemoryModal
        isOpen={isTeachModalOpen}
        onClose={() => setIsTeachModalOpen(false)}
      />
    </div>
  );
}
