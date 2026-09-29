"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, BookmarkPlus, Check, Sparkles } from "lucide-react";
import { TeachMemoryModal } from "./teach-memory-modal";
import { TeachMemoryCategory } from "@/lib/memory/types";

interface RecommendationFeedbackProps {
  query: string;
  summary: string;
}

export function RecommendationFeedback({ query, summary }: RecommendationFeedbackProps) {
  const [feedbackVote, setFeedbackVote] = React.useState<"useful" | "not_useful" | null>(null);
  const [feedbackText, setFeedbackText] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState("");
  const [modalCategory, setModalCategory] = React.useState<TeachMemoryCategory>("CONTENT");
  const [modalContext, setModalContext] = React.useState("");
  const [hasSavedFeedback, setHasSavedFeedback] = React.useState(false);

  const handleVote = (vote: "useful" | "not_useful") => {
    setFeedbackVote(vote);
  };

  const handleOpenPositiveTeach = () => {
    setModalContent(`Northstar content strategy recommendation for "${query}" was effective: ${summary}`);
    setModalCategory("CONTENT");
    setModalContext("Approved Strategy Feedback");
    setIsModalOpen(true);
  };

  const handleOpenNegativeTeach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setModalContent(feedbackText.trim());
    setModalCategory("CONTENT");
    setModalContext("Strategic Correction & Feedback");
    setIsModalOpen(true);
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)]/40 p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-xs font-semibold text-[var(--text-primary)]">
            Was this strategy recommendation useful?
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleVote("useful")}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
              feedbackVote === "useful"
                ? "border-[var(--status-success)] bg-[var(--status-success)]/10 text-[var(--status-success)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]"
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            Yes
          </button>

          <button
            type="button"
            onClick={() => handleVote("not_useful")}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
              feedbackVote === "not_useful"
                ? "border-[var(--status-warning)] bg-[var(--status-warning)]/10 text-[var(--status-warning)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]"
            }`}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            No
          </button>
        </div>
      </div>

      {/* Positive Feedback Branch */}
      {feedbackVote === "useful" && !hasSavedFeedback && (
        <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-[var(--text-muted)]">
            Glad this was helpful! Would you like Northstar to remember why this direction worked?
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleOpenPositiveTeach}
            className="h-7 text-xs gap-1.5 self-start sm:self-auto"
          >
            <BookmarkPlus className="h-3.5 w-3.5 text-[var(--accent)]" />
            Remember why this worked
          </Button>
        </div>
      )}

      {/* Negative Feedback Branch */}
      {feedbackVote === "not_useful" && !hasSavedFeedback && (
        <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
          <label className="block text-xs text-[var(--text-secondary)]">
            Tell us what should change or be avoided next time:
          </label>
          <form onSubmit={handleOpenNegativeTeach} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="e.g. Make recommendations more specific to LinkedIn workflow teardowns."
              className="flex-1 h-8 px-3 rounded-md border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-ring"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!feedbackText.trim() || feedbackText.trim().length < 5}
              className="h-8 text-xs shrink-0 gap-1.5"
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              Preview &amp; Save Preference
            </Button>
          </form>
          <p className="text-[11px] text-[var(--text-muted)] italic">
            Feedback will be previewed for confirmation before saving to permanent memory.
          </p>
        </div>
      )}

      {/* Saved Feedback Confirmation */}
      {hasSavedFeedback && (
        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center gap-1.5 text-xs text-[var(--status-success)]">
          <Check className="h-4 w-4" />
          <span>Strategic preference saved. It will guide future Northstar recommendations.</span>
        </div>
      )}

      {/* Modal with explicit confirmation */}
      <TeachMemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialContent={modalContent}
        initialCategory={modalCategory}
        initialContext={modalContext}
        source="user_feedback"
        onSuccess={() => {
          setHasSavedFeedback(true);
        }}
      />
    </div>
  );
}
