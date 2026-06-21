interface SkeletonProps {
  rows?: number;
  className?: string;
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="w-10 h-10 rounded-full bg-[var(--color-border)] animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-[var(--color-border)] rounded animate-pulse w-1/3" />
        <div className="h-3 bg-[var(--color-border)] rounded animate-pulse w-1/2" />
      </div>
      <div className="h-6 w-16 bg-[var(--color-border)] rounded-full animate-pulse" />
    </div>
  );
}

export function Skeleton({ rows = 5, className = '' }: SkeletonProps) {
  return (
    <div className={['divide-y divide-[var(--color-border)]', className].join(' ')}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)] space-y-3">
          <div className="h-4 bg-[var(--color-border)] rounded animate-pulse w-1/2" />
          <div className="h-8 bg-[var(--color-border)] rounded animate-pulse w-3/4" />
          <div className="h-3 bg-[var(--color-border)] rounded animate-pulse w-1/3" />
        </div>
      ))}
    </div>
  );
}
