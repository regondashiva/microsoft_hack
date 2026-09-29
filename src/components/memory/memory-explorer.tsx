"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SafeMemoryResult } from "@/lib/hindsight/types";
import { Search, Sparkles, Database, AlertCircle, BookmarkPlus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { TeachMemoryModal } from "@/components/strategist/teach-memory-modal";

const SUGGESTED_QUERIES = [
  "What is Northstar's target audience?",
  "What is Northstar's brand voice?",
  "What content does Northstar prefer?",
  "What campaigns has Northstar run?",
  "What is Northstar's positioning?",
];

interface MemoryExplorerProps {
  isConnected: boolean;
  onMemoryTaught?: () => void;
}

export function MemoryExplorer({ isConnected, onMemoryTaught }: MemoryExplorerProps) {
  const [query, setQuery] = React.useState("");
  const [activeQuery, setActiveQuery] = React.useState("");
  const [results, setResults] = React.useState<SafeMemoryResult[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isTeachModalOpen, setIsTeachModalOpen] = React.useState(false);

  const handleSearch = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setActiveQuery(trimmed);

    try {
      const res = await fetch("/api/memory/recall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to recall memories.");
      }

      setResults(data.results ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to recall memories.";
      setErrorMessage(message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleChipClick = (q: string) => {
    setQuery(q);
    handleSearch(q);
  };

  const renderSourceBadge = (item: SafeMemoryResult) => {
    const src = item.source || item.metadata?.source;

    if (src === "user_taught") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Source: User Taught
        </span>
      );
    }
    if (src === "user_feedback") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
          Source: User Feedback
        </span>
      );
    }
    if (src === "campaign_history") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Source: Campaign History
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
        Source: Seeded Brand Knowledge
      </span>
    );
  };

  return (
    <Card className="border-[var(--border)] bg-[var(--surface)]">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent)] mb-1">
              <Database className="h-4 w-4" />
              <span className="text-xs font-mono uppercase tracking-wider font-medium">
                Memory Explorer
              </span>
            </div>
            <CardTitle className="text-lg sm:text-xl">Search Persistent Brand Knowledge</CardTitle>
            <CardDescription>
              Query Northstar&apos;s Hindsight memory bank in natural language to recall verified brand facts, audience preferences, and taught rules.
            </CardDescription>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsTeachModalOpen(true)}
            disabled={!isConnected}
            className="gap-1.5 h-8 text-xs shrink-0 self-start sm:self-auto font-medium"
          >
            <BookmarkPlus className="h-3.5 w-3.5 text-[var(--accent)]" />
            Teach Strategic Memory
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Input Form */}
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. What is Northstar's brand voice?"
              disabled={isLoading || !isConnected}
              className={cn(
                "w-full h-11 pl-4 pr-32 rounded-lg border bg-[var(--surface-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-ring transition-colors",
                "border-[var(--border)] focus:border-[var(--accent)]",
                (!isConnected || isLoading) && "opacity-75 cursor-not-allowed"
              )}
            />
            <div className="absolute right-1.5 flex items-center gap-1.5">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!query.trim() || isLoading || !isConnected}
                isLoading={isLoading}
                className="gap-1.5 h-8 px-3"
              >
                {!isLoading && <Search className="h-3.5 w-3.5" />}
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* Quick Query Suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Suggested:
            </span>
            {SUGGESTED_QUERIES.map((sq) => (
              <button
                key={sq}
                type="button"
                onClick={() => handleChipClick(sq)}
                disabled={isLoading || !isConnected}
                className="inline-flex items-center text-xs px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-elevated)] transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                {sq}
              </button>
            ))}
          </div>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 text-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-subtle)]/40">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] mb-3 animate-pulse">
              <Database className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Searching persistent memory...
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Retrieving context from the Northstar Content Strategist memory bank
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && errorMessage && (
          <div className="flex items-start gap-3 p-4 rounded-lg border border-[var(--status-error-border)] bg-[var(--status-error-bg)] text-[var(--status-error)] text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Recall unavailable</p>
              <p className="text-xs opacity-90 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && results !== null && results.length === 0 && !errorMessage && (
          <div className="py-12 text-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-subtle)]/30">
            <p className="text-base font-medium text-[var(--text-primary)]">
              No relevant memories found.
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-md mx-auto">
              Try asking about the brand, audience, campaigns or content preferences.
            </p>
          </div>
        )}

        {/* Recalled Memory Results */}
        {!isLoading && results && results.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Recalled from persistent memory ({results.length} {results.length === 1 ? "result" : "results"})
              </span>
              <span className="text-xs text-[var(--text-muted)] italic">
                Query: &quot;{activeQuery}&quot;
              </span>
            </div>

            <div className="space-y-3">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]/60 hover:border-[var(--border-strong)] transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {renderSourceBadge(item)}
                      {item.category && (
                        <span className="text-[11px] font-mono uppercase text-[var(--text-muted)]">
                          [{item.category}]
                        </span>
                      )}
                    </div>
                    {item.context && (
                      <span className="text-xs text-[var(--text-muted)] font-mono">
                        {item.context}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed font-normal">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <TeachMemoryModal
        isOpen={isTeachModalOpen}
        onClose={() => setIsTeachModalOpen(false)}
        onSuccess={() => {
          if (onMemoryTaught) onMemoryTaught();
          if (activeQuery) handleSearch(activeQuery);
        }}
      />
    </Card>
  );
}
