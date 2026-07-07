'use client';
import { useQuery } from '@tanstack/react-query';
import { leasesService } from '@/services/leases.service';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/partials/Badge';
import { Button } from '@/components/partials/Button';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { ILease } from '@ems/shared';

const statusVariant: Record<ILease['status'], 'success' | 'warning' | 'danger' | 'neutral'> = {
  active: 'success', expired: 'neutral', terminated: 'danger', renewed: 'info' as 'success',
};

export function LeasesView() {
  const { data: leases, isLoading, error, refetch } = useQuery({ queryKey: ['leases'], queryFn: leasesService.getAll });

  if (isLoading) return <Skeleton rows={5} />;
  if (error) return <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load'} onRetry={() => void refetch()} />;
  if (!leases?.length) return <EmptyState title="No leases yet" icon="📄" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-[var(--font-display)]">Leases</h2>
        <Button size="sm">+ New Lease</Button>
      </div>
      <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-sunken)] border-b border-[var(--color-border)]">
            <tr>{['Property','Tenant','Start','End','Rent','Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {leases.map(l => (
              <tr key={l._id} className="hover:bg-[var(--color-surface-sunken)] transition-colors">
                <td className="px-4 py-3 font-medium">{l.propertyId && typeof l.propertyId === 'object' && 'title' in l.propertyId ? (l.propertyId as any).title : String(l.propertyId)}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{l.tenantId && typeof l.tenantId === 'object' && 'firstName' in l.tenantId ? `${(l.tenantId as any).firstName} ${(l.tenantId as any).lastName}` : String(l.tenantId)}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{formatDate(l.startDate)}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{formatDate(l.endDate)}</td>
                <td className="px-4 py-3 font-medium">{formatCurrency(l.monthlyRent)}</td>
                <td className="px-4 py-3"><Badge variant={statusVariant[l.status]}>{l.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
