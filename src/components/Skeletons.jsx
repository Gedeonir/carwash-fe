function Skeleton({ className = "" }) {
  return <div className={`bg-surface-200 rounded-xl animate-pulse ${className}`} />;
}

export function HistoryRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
      <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-1/2 h-3.5" />
        <Skeleton className="w-1/3 h-3" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-12 h-3.5" />
        <Skeleton className="w-8 h-3" />
      </div>
    </div>
  );
}