"use client";

import * as React from "react";
import { Menu, Search } from "lucide-react";
import { siteConfig } from "@/lib/config/site";

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-5 sm:px-8">
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] focus-ring"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <span className="text-[var(--text-muted)]">Organization:</span>
          <span className="font-medium text-[var(--text-primary)]">
            {siteConfig.defaultWorkspace.organization}
          </span>
          <span className="text-[var(--border-strong)]">/</span>
          <span>{siteConfig.defaultWorkspace.brandName}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            readOnly
            placeholder="Search campaigns & content..."
            value=""
            className="h-9 w-64 rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] pl-9 pr-3 text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] focus-ring cursor-default"
            aria-label="Search"
          />
        </div>
      </div>
    </header>
  );
}
