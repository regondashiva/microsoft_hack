import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AudienceContextData } from "@/features/dashboard/types";

interface AudienceContextSectionProps {
  audience: AudienceContextData;
}

export function AudienceContextSection({ audience }: AudienceContextSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Primary Audience
          </span>
          <p className="text-sm sm:text-[15px] font-medium text-[var(--text-primary)]">
            {audience.primaryAudience}
          </p>
        </div>

        <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Content Preference
          </span>
          <p className="text-sm sm:text-[15px] text-[var(--text-primary)] leading-relaxed">
            {audience.contentPreference}
          </p>
        </div>

        <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Preferred Tone
          </span>
          <p className="text-sm sm:text-[15px] text-[var(--text-primary)] leading-relaxed">
            {audience.preferredTone}
          </p>
        </div>

        <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--status-warning)]">
            Avoid
          </span>
          <p className="text-sm sm:text-[15px] text-[var(--text-secondary)] leading-relaxed">
            {audience.avoidApproach}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
