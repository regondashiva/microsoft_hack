"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  Users2,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";
import { siteConfig, type NavItem } from "@/lib/config/site";

const iconMap: Record<NavItem["iconName"], LucideIcon> = {
  LayoutDashboard,
  Sparkles,
  Layers,
  Users2,
  BrainCircuit,
};

interface SidebarNavProps {
  onItemClick?: () => void;
}

export function SidebarNav({ onItemClick }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1 px-3 py-3" aria-label="Main Navigation">
      {siteConfig.navigation.map((item) => {
        const Icon = iconMap[item.iconName];
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-ring",
              isActive
                ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] font-semibold"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]/60 hover:text-[var(--text-primary)]"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {Icon && (
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                )}
                aria-hidden="true"
              />
            )}
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
