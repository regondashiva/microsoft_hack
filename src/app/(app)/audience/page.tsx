import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Audience | MemoryAI",
  description: "Audience segments, content preferences, and strategic relevance for Northstar.",
};

interface AudienceSegment {
  id: string;
  name: string;
  tier: "Primary Audience" | "Secondary Audience";
  role: string;
  ageRange: string;
  interests: string[];
  contentPreference: string;
  primaryNeed: string;
  strategicRelevance: string;
  suggestedPrompt: string;
}

const audienceSegments: AudienceSegment[] = [
  {
    id: "seg-01",
    name: "Young Professionals",
    tier: "Primary Audience",
    role: "Individual contributors and emerging team leads in digital and tech-enabled roles",
    ageRange: "22–34",
    interests: ["Productivity", "Technology", "Career growth"],
    contentPreference: "Practical educational content, workflows, tactical teardowns",
    primaryNeed: "Actionable ways to eliminate friction from daily workflows and manage digital clutter.",
    strategicRelevance:
      "The AI Strategist references this segment to maintain a calm, evidence-based tone. Recommendations emphasize concrete tactical steps, personal leverage, and avoiding patronizing jargon.",
    suggestedPrompt: "What should we post next for young professionals?",
  },
  {
    id: "seg-02",
    name: "Small Business Owners",
    tier: "Secondary Audience",
    role: "Founders, operators, and independent business leaders seeking operational leverage",
    ageRange: "28–48",
    interests: ["Automation", "Business software", "Growth"],
    contentPreference: "Case studies, actionable guides, systems architecture",
    primaryNeed: "Reliable tools and streamlined processes that deliver immediate operational leverage.",
    strategicRelevance:
      "The AI Strategist applies business software and automation memories here, focusing on operational ROI, tool interoperability, and system resilience without inflated growth claims.",
    suggestedPrompt: "What should we create next for small business owners?",
  },
];

export default function AudiencePage() {
  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Audience"
        description="Target audience segments, content preferences, and strategic relevance for Northstar Brand Co."
      />

      {/* Overview Note */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-sm text-[var(--text-secondary)] leading-relaxed">
        <span className="font-semibold text-[var(--text-primary)]">Strategic Segmentation:</span> MemoryAI
        aligns content generation with these two verified audience profiles. Memory recall specifically filters
        and weights brand guidelines and campaign learnings relevant to the target segment in every query.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {audienceSegments.map((segment) => (
          <Card key={segment.id} className="relative flex flex-col justify-between h-full">
            <div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      segment.tier === "Primary Audience"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {segment.tier}
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Age: {segment.ageRange}
                  </span>
                </div>
                <CardTitle className="text-xl text-[var(--text-primary)]">{segment.name}</CardTitle>
                <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
                  {segment.role}
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Key Interests
                  </span>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {segment.interests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs sm:text-sm font-medium text-[var(--text-secondary)]"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 pt-3 border-t border-[var(--border-subtle)]">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Content Preference
                  </span>
                  <p className="text-sm sm:text-[15px] text-[var(--text-primary)] leading-relaxed">
                    {segment.contentPreference}
                  </p>
                </div>

                <div className="space-y-1 pt-3 border-t border-[var(--border-subtle)]">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Primary Need
                  </span>
                  <p className="text-sm sm:text-[15px] text-[var(--text-secondary)] leading-relaxed">
                    {segment.primaryNeed}
                  </p>
                </div>

                <div className="space-y-1 pt-3 border-t border-[var(--border-subtle)]">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Strategic Relevance for Strategist
                  </span>
                  <p className="text-sm sm:text-[15px] text-[var(--text-secondary)] leading-relaxed">
                    {segment.strategicRelevance}
                  </p>
                </div>
              </CardContent>
            </div>

            <div className="p-6 pt-2 border-t border-[var(--border-subtle)] mt-4">
              <Link href={`/strategist?q=${encodeURIComponent(segment.suggestedPrompt)}`} className="w-full">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Ask Strategist about {segment.name} →
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
