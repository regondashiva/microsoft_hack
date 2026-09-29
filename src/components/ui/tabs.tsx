import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Navigation tabs"
      className={cn(
        "flex items-center space-x-1 border-b border-[var(--border)] overflow-x-auto",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap focus-ring",
              isActive
                ? "border-[var(--text-primary)] text-[var(--text-primary)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
            )}
          >
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                  isActive
                    ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] font-semibold"
                    : "bg-[var(--surface-elevated)] text-[var(--text-muted)]"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
