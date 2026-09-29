import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  note?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  note,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center border border-dashed border-[var(--border)] rounded-lg bg-[var(--surface-subtle)]",
        className
      )}
    >
      {Icon && (
        <div className="h-10 w-10 rounded-md bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center mb-4 text-[var(--text-muted)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">
        {title}
      </h4>
      <p className="text-xs text-[var(--text-muted)] max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-1">{action}</div>}
      {note && (
        <span className="mt-3 text-[11px] font-mono text-[var(--text-muted)] opacity-80">
          {note}
        </span>
      )}
    </div>
  );
}
