import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, Users, Megaphone, BookOpen } from "lucide-react";

interface KnowledgeOverviewProps {
  totalMemories?: number;
}

export function KnowledgeOverview({ totalMemories }: KnowledgeOverviewProps) {
  const categories = [
    {
      title: "Brand Knowledge",
      icon: ShieldCheck,
      description: "Consumer technology mission, market positioning, and utility-first product philosophy.",
      highlight: "Practical technology for focused work and living",
    },
    {
      title: "Audience Knowledge",
      icon: Users,
      description: "Primary segment of young professionals (22–34) and secondary segment of small business operators.",
      highlight: "Values evidence, clarity, and time efficiency",
    },
    {
      title: "Campaign Context",
      icon: Megaphone,
      description: "Documented campaign learnings across LinkedIn and Instagram initiatives.",
      highlight: "Focus on actionable workflow breakdowns",
    },
    {
      title: "Content Preferences",
      icon: BookOpen,
      description: "Strict avoidance of promotional hype in favor of educational and concise guidance.",
      highlight: "Evidence-aware and confident voice",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            Persistent Knowledge Structure
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            Core strategic categories stored in the Northstar Content Strategist memory bank.
          </p>
        </div>
        {typeof totalMemories === "number" && totalMemories > 0 && (
          <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--surface-subtle)] px-2.5 py-1 rounded-md border border-[var(--border)]">
            {totalMemories} Verified Memories
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Card key={cat.title} className="bg-[var(--surface)] border-[var(--border)]">
              <CardHeader className="p-5 pb-2 border-none">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-md bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-[var(--text-primary)]">
                    {cat.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-2">
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {cat.description}
                </p>
                <div className="pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)] flex items-center gap-1.5 font-mono">
                  <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                  <span>{cat.highlight}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
