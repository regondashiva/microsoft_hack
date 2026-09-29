"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ConnectionBanner } from "@/components/memory/connection-banner";
import { KnowledgeOverview } from "@/components/memory/knowledge-overview";
import { MemoryExplorer } from "@/components/memory/memory-explorer";
import { MemoryStatusResponse } from "@/lib/hindsight/types";

export default function MemoryPage() {
  const [status, setStatus] = React.useState<MemoryStatusResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isInitializing, setIsInitializing] = React.useState(false);

  const loadStatus = React.useCallback(async (triggerInitIfEmpty = false) => {
    try {
      const res = await fetch("/api/memory/status");
      const data = (await res.json()) as MemoryStatusResponse;
      setStatus(data);

      if (triggerInitIfEmpty && data.connected && data.totalMemories === 0) {
        setIsInitializing(true);
        const initRes = await fetch("/api/memory/initialize", { method: "POST" });
        if (initRes.ok) {
          const updatedRes = await fetch("/api/memory/status");
          if (updatedRes.ok) {
            const updated = (await updatedRes.json()) as MemoryStatusResponse;
            setStatus(updated);
          }
        }
        setIsInitializing(false);
      }
    } catch {
      setStatus({
        connected: false,
        status: "error",
        bankId: "northstar-content-strategist",
        bankName: "Northstar Content Strategist",
        message: "Unable to reach persistent memory service.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = React.useCallback(() => {
    setIsLoading(true);
    loadStatus(false);
  }, [loadStatus]);

  const handleManualInitialize = React.useCallback(async () => {
    setIsInitializing(true);
    try {
      const initRes = await fetch("/api/memory/initialize", { method: "POST" });
      if (initRes.ok) {
        const updatedRes = await fetch("/api/memory/status");
        if (updatedRes.ok) {
          const updated = (await updatedRes.json()) as MemoryStatusResponse;
          setStatus(updated);
        }
      }
    } finally {
      setIsInitializing(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    fetch("/api/memory/status")
      .then((res) => res.json())
      .then((data: MemoryStatusResponse) => {
        if (!isMounted) return;
        setStatus(data);
        setIsLoading(false);

        if (data.connected && data.totalMemories === 0) {
          setIsInitializing(true);
          fetch("/api/memory/initialize", { method: "POST" })
            .then(() => fetch("/api/memory/status"))
            .then((r) => r.json())
            .then((updated: MemoryStatusResponse) => {
              if (isMounted) setStatus(updated);
            })
            .catch(() => {})
            .finally(() => {
              if (isMounted) setIsInitializing(false);
            });
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus({
          connected: false,
          status: "error",
          bankId: "northstar-content-strategist",
          bankName: "Northstar Content Strategist",
          message: "Unable to reach persistent memory service.",
        });
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const isConnected = status?.connected === true && status.status === "connected";

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Memory"
        description="Northstar's persistent brand knowledge."
      />

      {/* Connection & Bank Status */}
      <section>
        <ConnectionBanner
          status={status}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onInitialize={handleManualInitialize}
          isInitializing={isInitializing}
        />
      </section>

      {/* Strategic Knowledge Overview */}
      <section>
        <KnowledgeOverview totalMemories={status?.totalMemories} />
      </section>

      {/* Interactive Natural Language Memory Explorer */}
      <section>
        <MemoryExplorer isConnected={isConnected} onMemoryTaught={handleRefresh} />
      </section>
    </div>
  );
}
