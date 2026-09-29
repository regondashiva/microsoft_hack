"use client";

import * as React from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error to console in development
    console.error("Application error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <ErrorState
        title="Application Exception"
        message={error.message || "An unexpected error occurred in the workspace."}
        onRetry={reset}
      />
    </div>
  );
}
