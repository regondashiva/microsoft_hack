import * as React from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { StrategistWorkspace } from "@/components/strategist/strategist-workspace";

export const metadata: Metadata = {
  title: "Strategist | MemoryAI",
  description: "Turn Northstar's brand memory into practical content decisions.",
};

export default function StrategistPage() {
  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="AI Content Strategist"
        description="Turn Northstar's brand memory into practical content decisions."
      />

      <StrategistWorkspace />
    </div>
  );
}
