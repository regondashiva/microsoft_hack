import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type StatusType =
  | "active"
  | "completed"
  | "in_review"
  | "draft"
  | "planned"
  | "archived";

interface StatusPillProps {
  status: StatusType | string;
  label?: string;
  className?: string;
}

export function StatusPill({ status, label, className }: StatusPillProps) {
  const normalized = status.toLowerCase().replace(/[\s-]/g, "_") as StatusType;

  const config: Record<
    StatusType,
    { label: string; dotClass: string; badgeClass: string }
  > = {
    active: {
      label: "Active",
      dotClass: "bg-[var(--status-success)]",
      badgeClass:
        "bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]",
    },
    completed: {
      label: "Completed",
      dotClass: "bg-[var(--text-muted)]",
      badgeClass:
        "bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border)]",
    },
    in_review: {
      label: "In Review",
      dotClass: "bg-[var(--status-warning)]",
      badgeClass:
        "bg-[var(--status-warning-bg)] text-[var(--status-warning)] border-[var(--status-warning-border)]",
    },
    draft: {
      label: "Draft",
      dotClass: "bg-[var(--border-strong)]",
      badgeClass:
        "bg-[var(--surface-elevated)] text-[var(--text-muted)] border-[var(--border)]",
    },
    planned: {
      label: "Planned",
      dotClass: "bg-[var(--status-info)]",
      badgeClass:
        "bg-[var(--status-info-bg)] text-[var(--status-info)] border-[var(--status-info-border)]",
    },
    archived: {
      label: "Archived",
      dotClass: "bg-[var(--border-strong)]",
      badgeClass:
        "bg-transparent text-[var(--text-muted)] border-[var(--border)]",
    },
  };

  const item = config[normalized] || {
    label: label || status,
    dotClass: "bg-[var(--text-muted)]",
    badgeClass:
      "bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border tracking-tight",
        item.badgeClass,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", item.dotClass)} />
      {label || item.label}
    </span>
  );
}
