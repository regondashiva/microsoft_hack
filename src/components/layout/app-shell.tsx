"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { X } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Close mobile drawer on Escape key press
  React.useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-app)]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-[var(--surface)] shadow-xl">
            <div className="absolute top-2 right-2">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-ring"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar onItemClick={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        
        <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 md:px-12 lg:px-14">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
