import { Button } from '@/components/partials/Button';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <div
      className={[
        'bg-white rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)]',
        'hover:shadow-md transition-shadow duration-200',
        className,
      ].join(' ')}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-[var(--color-muted)]">{title}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className="text-3xl font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
        {value}
      </p>
      {trend && (
        <p className={['text-xs mt-2 font-medium', trend.positive ? 'text-[var(--color-accent)]' : 'text-[var(--color-danger)]'].join(' ')}>
          {trend.positive ? '↑' : '↓'} {trend.value}
        </p>
      )}
    </div>
  );
}

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <span className="text-4xl">⚠️</span>
      <p className="text-sm text-[var(--color-danger)] font-medium">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
