import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Failed to load data",
  message = "An unexpected error occurred while loading this section. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center border border-[var(--status-error-border)] rounded-lg bg-[var(--status-error-bg)]",
        className
      )}
    >
      <div className="h-9 w-9 rounded-full bg-[var(--surface)] border border-[var(--status-error-border)] flex items-center justify-center mb-3 text-[var(--status-error)]">
        <AlertCircle className="h-5 w-5" aria-hidden="true" />
      </div>
      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
        {title}
      </h4>
      <p className="text-xs text-[var(--text-secondary)] max-w-sm mb-4 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
}
