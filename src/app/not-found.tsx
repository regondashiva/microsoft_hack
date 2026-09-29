import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[var(--bg-app)]">
      <div className="max-w-md space-y-4">
        <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
          Error 404
        </span>
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
          Page Not Found
        </h2>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          The requested strategy workspace route does not exist or has been relocated.
        </p>
        <div className="pt-2">
          <Link href="/dashboard">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
