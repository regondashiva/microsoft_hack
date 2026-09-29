import { LoadingCard } from "@/components/ui/loading-state";

export default function Loading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="h-8 w-48 bg-[var(--border-subtle)] rounded animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingCard key={i} rows={2} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoadingCard rows={5} />
        <LoadingCard rows={5} />
      </div>
    </div>
  );
}
