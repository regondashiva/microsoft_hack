import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ContentDirectionData } from "@/features/dashboard/types";

interface ContentDirectionSectionProps {
  direction: ContentDirectionData;
}

export function ContentDirectionSection({ direction }: ContentDirectionSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Direction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Primary Content Themes
          </span>
          <ul className="space-y-1.5 text-sm sm:text-[15px] text-[var(--text-primary)]">
            {direction.primaryThemes.map((theme) => (
              <li key={theme} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] shrink-0" />
                <span>{theme}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)]">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Brand Voice
          </span>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {direction.brandVoiceTraits.map((trait) => (
              <div
                key={trait}
                className="rounded border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm font-medium text-[var(--text-primary)]"
              >
                {trait}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
