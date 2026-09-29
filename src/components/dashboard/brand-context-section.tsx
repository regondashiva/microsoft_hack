import * as React from "react";
import { Brand } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BrandContextSectionProps {
  brand: Brand;
}

export function BrandContextSection({ brand }: BrandContextSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Brand
            </span>
            <p className="text-base font-medium text-[var(--text-primary)]">
              {brand.name}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Industry
            </span>
            <p className="text-base font-medium text-[var(--text-primary)]">
              {brand.industry}
            </p>
          </div>
        </div>

        <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Audience
          </span>
          <p className="text-sm sm:text-[15px] text-[var(--text-primary)] leading-relaxed">
            {brand.targetMarket}
          </p>
        </div>

        <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Brand Positioning
          </span>
          <p className="text-sm sm:text-[15px] text-[var(--text-primary)] leading-relaxed">
            {brand.tagline}
          </p>
        </div>

        <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Current Content Objective
          </span>
          <p className="text-sm sm:text-[15px] text-[var(--text-primary)] leading-relaxed">
            {brand.currentObjective}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
