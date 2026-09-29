import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "subtle" | "success" | "warning" | "error" | "info" | "outline";
}

export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-mono text-[11px] font-medium tracking-tight rounded px-1.5 py-0.5 border";

  const variantStyles = {
    neutral:
      "bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border)]",
    subtle:
      "bg-transparent text-[var(--text-muted)] border-transparent",
    success:
      "bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]",
    warning:
      "bg-[var(--status-warning-bg)] text-[var(--status-warning)] border-[var(--status-warning-border)]",
    error:
      "bg-[var(--status-error-bg)] text-[var(--status-error)] border-[var(--status-error-border)]",
    info:
      "bg-[var(--status-info-bg)] text-[var(--status-info)] border-[var(--status-info-border)]",
    outline:
      "border-[var(--border-strong)] text-[var(--text-primary)] bg-transparent",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
}
