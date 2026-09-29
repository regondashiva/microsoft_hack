"use client";

import * as React from "react";
import { MemoryStatusResponse } from "@/lib/hindsight/types";
import { Button } from "@/components/ui/button";
import { Database, CheckCircle2, AlertCircle, RefreshCw, Layers } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ConnectionBannerProps {
  status: MemoryStatusResponse | null;
  isLoading: boolean;
  onRefresh: () => void;
  onInitialize: () => void;
  isInitializing: boolean;
}

export function ConnectionBanner({
  status,
  isLoading,
  onRefresh,
  onInitialize,
  isInitializing,
}: ConnectionBannerProps) {
  const isConnected = status?.connected === true && status.status === "connected";
  const isError = status?.status === "error";

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Status Indicator & Title */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
              isConnected
                ? "bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]"
                : isError
                ? "bg-[var(--status-error-bg)] text-[var(--status-error)] border-[var(--status-error-border)]"
                : "bg-[var(--surface-subtle)] text-[var(--text-muted)] border-[var(--border)]"
            )}
          >
            {isConnected ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : isError ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <Database className="h-5 w-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                {status?.bankName || "Northstar Content Strategist"}
              </h2>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                  isConnected
                    ? "bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]"
                    : isError
                    ? "bg-[var(--status-error-bg)] text-[var(--status-error)] border-[var(--status-error-border)]"
                    : "bg-[var(--surface-elevated)] text-[var(--text-muted)] border-[var(--border)]"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    isConnected
                      ? "bg-[var(--status-success)]"
                      : isError
                      ? "bg-[var(--status-error)]"
                      : "bg-[var(--text-muted)]"
                  )}
                />
                {isLoading
                  ? "Connecting..."
                  : isConnected
                  ? "Connected"
                  : isError
                  ? "Error"
                  : "Disconnected"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
              {isLoading
                ? "Connecting to persistent memory..."
                : isConnected
                ? "Persistent memory is connected."
                : isError
                ? "Unable to reach persistent memory."
                : "Memory is currently unavailable."}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isConnected && (!status?.totalMemories || status.totalMemories === 0) && (
            <Button
              variant="primary"
              size="sm"
              onClick={onInitialize}
              isLoading={isInitializing}
              className="gap-1.5"
            >
              <Layers className="h-3.5 w-3.5" />
              Initialize Brand Knowledge
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            isLoading={isLoading}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] h-8 px-2.5"
            aria-label="Refresh memory connection status"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Meta Information Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[var(--border-subtle)] text-xs">
        <div>
          <span className="text-[var(--text-muted)] block">Memory Bank ID</span>
          <span className="font-mono text-[var(--text-secondary)] font-medium">
            {status?.bankId || "northstar-content-strategist"}
          </span>
        </div>
        <div>
          <span className="text-[var(--text-muted)] block">Stored Knowledge</span>
          <span className="text-[var(--text-secondary)] font-medium">
            {typeof status?.totalMemories === "number"
              ? `${status.totalMemories} strategic memories`
              : "Checking bank..."}
          </span>
        </div>
        <div>
          <span className="text-[var(--text-muted)] block">Security Level</span>
          <span className="text-[var(--text-secondary)] font-medium">
            Server-side isolation (Zero-leakage)
          </span>
        </div>
      </div>
    </div>
  );
}
