import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CampaignProvider } from "@/features/campaigns/campaign-store";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CampaignProvider>
      <AppShell>{children}</AppShell>
    </CampaignProvider>
  );
}
