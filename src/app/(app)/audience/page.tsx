import * as React from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Audience | MemoryAI",
  description: "Audience segments, content preferences, and focus areas for Northstar.",
};

interface AudienceSegment {
  id: string;
  name: string;
  role: string;
  ageRange: string;
  interests: string[];
  contentPreference: string;
  primaryNeed: string;
}

const audienceSegments: AudienceSegment[] = [
  {
    id: "seg-01",
    name: "Young Professionals",
    role: "Individual contributors and team leads in digital and tech-enabled roles",
    ageRange: "22–34",
    interests: ["Productivity", "Technology", "Career growth"],
    contentPreference: "Practical educational content",
    primaryNeed: "Actionable ways to eliminate friction from daily workflows and manage digital clutter.",
  },
  {
    id: "seg-02",
    name: "Small Business Owners",
    role: "Founders, operators, and independent business leaders",
    ageRange: "28–48",
    interests: ["Automation", "Business software", "Growth"],
    contentPreference: "Case studies and actionable guides",
    primaryNeed: "Reliable tools and streamlined processes that deliver immediate operational leverage.",
  },
];

export default function AudiencePage() {
  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Audience"
        description="Core audience segments, content preferences, and focus areas for Northstar Brand Co."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {audienceSegments.map((segment) => (
          <Card key={segment.id}>
            <CardHeader>
              <CardTitle>{segment.name}</CardTitle>
              <p className="text-sm text-[var(--text-muted)] mt-0.5 leading-relaxed">
                {segment.role}
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  Age Range
                </span>
                <p className="text-sm sm:text-[15px] font-medium text-[var(--text-primary)]">
                  {segment.ageRange}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)]">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  Interests
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
                  Primary Focus
                </span>
                <p className="text-sm sm:text-[15px] text-[var(--text-secondary)] leading-relaxed">
                  {segment.primaryNeed}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
