"use client";

import * as React from "react";
import { StrategistForm } from "./strategist-form";
import { StrategyView } from "./strategy-view";
import { TeachMemoryModal } from "./teach-memory-modal";
import { StrategyResponse, StrategistApiResponse } from "@/lib/strategist/types";
import { AlertCircle, Compass, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StrategistWorkspace() {
  const [query, setQuery] = React.useState("");
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
      const message = err instanceof Error ? err.message : "Strategy formulation failed.";
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
        <div className="py-16 text-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-subtle)]/40">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] mb-3 animate-pulse">
            <Compass className="h-6 w-6" />
          </div>
          <p className="text-base font-medium text-[var(--text-primary)]">
            Recalling Northstar context and building strategy...
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
            Retrieving verified memory from Hindsight and synthesizing strategic direction with LLM reasoning
          </p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && errorMessage && (
        <div className="flex items-start gap-3 p-5 rounded-xl border border-[var(--status-error-border)] bg-[var(--status-error-bg)] text-[var(--status-error)] text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-base">Strategy Formulation Unavailable</p>
            <p className="text-xs sm:text-sm opacity-90 mt-1 leading-relaxed">
              {errorMessage}
            </p>
          </div>
        </div>
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
