'use client';
import { useQuery } from '@tanstack/react-query';
import { maintenanceService } from '@/services/maintenance.service';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/partials/Badge';
import { Button } from '@/components/partials/Button';
import { formatDate } from '@/lib/utils';
import type { IMaintenanceRequest } from '@ems/shared';

const priorityVariant: Record<IMaintenanceRequest['priority'], 'success' | 'warning' | 'danger' | 'neutral'> = {
  low: 'neutral', medium: 'warning', high: 'danger', urgent: 'danger',
};

export function MaintenanceView() {
  const { data: items, isLoading, error, refetch } = useQuery({ queryKey: ['maintenance'], queryFn: maintenanceService.getAll });

  if (isLoading) return <Skeleton rows={6} />;
  if (error) return <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load'} onRetry={() => void refetch()} />;
  if (!items?.length) return <EmptyState title="No maintenance requests" icon="🔧" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-[var(--font-display)]">Maintenance Requests</h2>
        <Button size="sm">+ New Request</Button>
      </div>
      <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
            <tr>{['Title','Priority','Status','Created'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {items.map(m => (
              <tr key={m._id} className="hover:bg-[var(--color-surface)] transition-colors">
                <td className="px-4 py-3 font-medium">{m.title}</td>
                <td className="px-4 py-3"><Badge variant={priorityVariant[m.priority]}>{m.priority}</Badge></td>
                <td className="px-4 py-3"><Badge variant="info">{m.status}</Badge></td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{formatDate(m.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
