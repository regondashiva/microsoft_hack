"use client";

import * as React from "react";
import Link from "next/link";
import { SidebarNav } from "@/components/navigation/sidebar-nav";
import { siteConfig } from "@/lib/config/site";
import { Building2 } from "lucide-react";

interface SidebarProps {
  onItemClick?: () => void;
}

export function Sidebar({ onItemClick }: SidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]">
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-[var(--border)] px-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 font-semibold tracking-tight text-base focus-ring rounded"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-foreground)] font-mono text-sm font-bold">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight leading-tight">
              {siteConfig.name}
            </span>
            <span className="text-xs text-[var(--text-muted)] mt-0.5">
              AI Content Strategist
            </span>
          </div>
        </Link>
      </div>

      {/* Organization / Workspace Context */}
      <div className="p-4 border-b border-[var(--border-subtle)]">
        <div className="rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
            <span className="text-sm font-medium text-[var(--text-primary)] truncate">
              {siteConfig.defaultWorkspace.organization}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)] truncate pl-6">
            {siteConfig.defaultWorkspace.industry}
          </p>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <SidebarNav onItemClick={onItemClick} />
      </div>

      {/* User / Workspace Account Area */}
      <div className="flex items-center gap-3 border-t border-[var(--border)] p-4">
        <div className="h-8 w-8 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center font-mono text-xs font-medium text-[var(--text-secondary)] shrink-0">
          NS
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">
            Content Team
          </span>
          <span className="text-xs text-[var(--text-muted)] truncate">
            {siteConfig.defaultWorkspace.brandName} Workspace
          </span>
        </div>
      </div>
    </aside>
  );
}
