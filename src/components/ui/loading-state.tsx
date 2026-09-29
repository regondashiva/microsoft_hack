import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-[var(--border-subtle)]/70",
        className
      )}
      {...props}
    />
  );
}

export function LoadingCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-3 w-full", i === rows - 1 ? "w-2/3" : "")}
          />
        ))}
      </div>
    </div>
  );
}

export function LoadingTableRows({ count = 4 }: { count?: number }) {
  return (
    <div className="divide-y divide-[var(--border-subtle)]">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}
