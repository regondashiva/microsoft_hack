"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const SUGGESTED_STRATEGY_QUESTIONS = [
  "What should Northstar post next?",
  "How should we speak to young professionals?",
  "What content themes fit our brand?",
  "How should we approach LinkedIn?",
  "What should Northstar avoid in its messaging?",
];

interface StrategistFormProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit: (q: string) => void;
  isLoading: boolean;
}

export function StrategistForm({
  query,
  onQueryChange,
  onSubmit,
  isLoading,
}: StrategistFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
    }
  };

  const handleChipClick = (suggestion: string) => {
    onQueryChange(suggestion);
    onSubmit(suggestion);
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
      <div className="space-y-1">
        <label
          htmlFor="strategist-query"
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          Ask your content strategist
        </label>
        <p className="text-xs text-[var(--text-muted)]">
          Submit strategic content questions. The strategist grounds every recommendation in Northstar&apos;s persistent brand memory.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative flex items-center">
          <input
            id="strategist-query"
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="e.g. What should Northstar post next?"
            disabled={isLoading}
            className={cn(
              "w-full h-11 pl-4 pr-36 rounded-lg border bg-[var(--surface-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-ring transition-colors",
              "border-[var(--border)] focus:border-[var(--accent)]",
              isLoading && "opacity-75 cursor-not-allowed"
            )}
          />
          <div className="absolute right-1.5 flex items-center">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!query.trim() || isLoading}
              isLoading={isLoading}
              className="gap-1.5 h-8 px-3.5"
            >
              {!isLoading && <Search className="h-3.5 w-3.5" />}
              {isLoading ? "Formulating..." : "Formulate"}
            </Button>
          </div>
        </div>

        {/* Suggested Strategic Queries */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 shrink-0">
            <Sparkles className="h-3 w-3" />
            Suggested:
          </span>
          {SUGGESTED_STRATEGY_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => handleChipClick(question)}
              disabled={isLoading}
              className="inline-flex items-center text-xs px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-elevated)] transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {question}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
