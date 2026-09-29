"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { TeachMemoryCategory, TeachMemorySource } from "@/lib/memory/types";
import { BookmarkPlus, CheckCircle2, AlertCircle, Eye, ArrowLeft, X } from "lucide-react";

export interface TeachMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent?: string;
  initialCategory?: TeachMemoryCategory;
  initialContext?: string;
  source?: TeachMemorySource;
  onSuccess?: (memory: { id: string; content: string; category: string }) => void;
}

const CATEGORIES: TeachMemoryCategory[] = ["CONTENT", "BRAND", "AUDIENCE", "CAMPAIGN", "STRATEGIC"];

function TeachMemoryModalDialog({
  onClose,
  initialContent = "",
  initialCategory = "CONTENT",
  initialContext = "",
  source = "user_taught",
  onSuccess,
}: Omit<TeachMemoryModalProps, "isOpen">) {
  const [content, setContent] = React.useState(initialContent);
  const [category, setCategory] = React.useState<TeachMemoryCategory>(initialCategory);
  const [context, setContext] = React.useState(initialContext);
  const [step, setStep] = React.useState<"edit" | "preview" | "success">("edit");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [warningMessage, setWarningMessage] = React.useState<string | null>(null);
  const [savedMemory, setSavedMemory] = React.useState<{ id: string; content: string; category: string } | null>(null);

  // Close modal on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isLoading]);

  const handleProceedToPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!content.trim() || content.trim().length < 5) {
      setErrorMessage("Memory content must be at least 5 characters.");
      return;
    }
    setErrorMessage(null);
    setStep("preview");
  };

  const handleConfirmSave = async () => {
    if (isLoading) return; // Prevent double submission
    setIsLoading(true);
    setErrorMessage(null);
    setWarningMessage(null);

    try {
      const res = await fetch("/api/memory/teach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          category,
          context: context.trim() || undefined,
          source,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to persist memory.");
      }

      setSavedMemory(data.memory);
      if (data.warning) {
        setWarningMessage(data.warning);
      }
      setStep("success");
      if (onSuccess && data.memory) {
        onSuccess(data.memory);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to persist memory.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-[var(--surface-subtle)]/50">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="h-4 w-4 text-[var(--accent)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {step === "preview" ? "Preview Strategic Memory" : step === "success" ? "Memory Persisted" : "Teach Northstar Strategic Memory"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-[var(--status-error-border)] bg-[var(--status-error-bg)] text-[var(--status-error)] text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === "edit" && (
            <form onSubmit={handleProceedToPreview} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Strategic Preference or Rule <span className="text-[var(--accent)]">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g. Northstar's LinkedIn audience responds better to practical workflow examples than generic productivity tips."
                  rows={4}
                  maxLength={600}
                  className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-ring resize-none"
                  required
                />
                <div className="flex justify-between items-center mt-1 text-[11px] text-[var(--text-muted)]">
                  <span>Be specific and actionable. Avoid casual chat.</span>
                  <span>{content.length}/600</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                    Category <span className="text-[var(--accent)]">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TeachMemoryCategory)}
                    className="w-full h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] text-xs text-[var(--text-primary)] focus-ring"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                    Context Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g. LinkedIn Strategy"
                    maxLength={120}
                    className="w-full h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] text-xs text-[var(--text-primary)] focus-ring"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={!content.trim() || content.trim().length < 5}>
                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                  Preview Memory
                </Button>
              </div>
            </form>
          )}

          {step === "preview" && (
            <div className="space-y-4">
              <p className="text-xs text-[var(--text-secondary)]">
                Review the exact strategic knowledge record before it is permanently stored in Northstar&apos;s Hindsight memory bank:
              </p>

              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center px-2 py-0.5 rounded font-mono font-medium bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                    Category: {category}
                  </span>
                  <span className="text-[var(--text-muted)] font-mono">
                    {context.trim() || `User Taught ${category}`}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed pt-1 font-normal">
                  {content.trim()}
                </p>
              </div>

              <p className="text-[11px] text-[var(--text-muted)] italic">
                Once saved, this preference will be available during future Hindsight recall to influence the AI Content Strategist.
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setStep("edit")}
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>

                <div className="flex items-center gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleConfirmSave}
                    isLoading={isLoading}
                  >
                    <BookmarkPlus className="h-3.5 w-3.5 mr-1.5" />
                    Save to Memory
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="space-y-4 text-center py-4">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-[var(--status-success)]/10 text-[var(--status-success)] mb-1">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-[var(--text-primary)]">
                  Strategic Preference Remembered
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
                  Stored in Northstar&apos;s persistent Hindsight memory bank. It will be recalled when generating relevant future content strategies.
                </p>
              </div>

              {warningMessage && (
                <div className="text-left p-3 rounded-lg border border-[var(--status-warning-border)] bg-[var(--status-warning-bg)]/40 text-xs text-[var(--text-secondary)]">
                  <p className="font-semibold text-[var(--status-warning)] mb-0.5">Note on Historical Context:</p>
                  <p>{warningMessage}</p>
                </div>
              )}

              {savedMemory && (
                <div className="text-left p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] text-xs text-[var(--text-primary)]">
                  <span className="font-mono text-[var(--accent)] uppercase text-[10px] block mb-1">
                    [{savedMemory.category}]
                  </span>
                  {savedMemory.content}
                </div>
              )}

              <div className="pt-2 flex justify-center">
                <Button type="button" variant="primary" size="sm" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TeachMemoryModal(props: TeachMemoryModalProps) {
  if (!props.isOpen) return null;
  return (
    <TeachMemoryModalDialog
      key={`${props.initialContent || ""}-${props.initialCategory || "CONTENT"}-${props.initialContext || ""}`}
      onClose={props.onClose}
      initialContent={props.initialContent}
      initialCategory={props.initialCategory}
      initialContext={props.initialContext}
      source={props.source}
      onSuccess={props.onSuccess}
    />
  );
}
