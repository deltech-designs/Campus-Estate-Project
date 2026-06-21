'use client';
import { useQuery } from '@tanstack/react-query';
import { tenantsService } from '@/services/tenants.service';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/partials/Badge';
import { Button } from '@/components/partials/Button';
import { Avatar } from '@/components/partials/Avatar';
import { fullName } from '@/lib/utils';
import type { ITenant } from '@ems/shared';

const statusVariant: Record<ITenant['status'], 'success' | 'danger' | 'neutral'> = {
  active: 'success', inactive: 'neutral', blacklisted: 'danger',
};

export function TenantsView() {
  const { data: tenants, isLoading, error, refetch } = useQuery({ queryKey: ['tenants'], queryFn: tenantsService.getAll });

  if (isLoading) return <Skeleton rows={6} />;
  if (error) return <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load'} onRetry={() => void refetch()} />;
  if (!tenants?.length) return <EmptyState title="No tenants yet" icon="👥" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-[var(--font-display)]">Tenants</h2>
        <Button size="sm">+ Add Tenant</Button>
      </div>
      <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
            <tr>{['Tenant','Email','Phone','Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {tenants.map(t => (
              <tr key={t._id} className="hover:bg-[var(--color-surface)] transition-colors">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar name={fullName(t.firstName, t.lastName)} size="sm" /><span className="font-medium">{fullName(t.firstName, t.lastName)}</span></div></td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{t.email}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{t.phone}</td>
                <td className="px-4 py-3"><Badge variant={statusVariant[t.status]}>{t.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
