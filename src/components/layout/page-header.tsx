import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]",
        className
      )}
    >
      <div className="space-y-1.5 max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          {title}
        </h1>
        {description && (
          <p className="text-sm sm:text-[15px] text-[var(--text-secondary)] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          {actions}
        </div>
      )}
    </div>
  );
}
