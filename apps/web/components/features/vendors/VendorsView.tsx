'use client';
import { useQuery } from '@tanstack/react-query';
import { vendorsService } from '@/services/vendors.service';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/partials/Badge';
import { Button } from '@/components/partials/Button';
import type { IVendor } from '@ems/shared';

const statusVariant: Record<IVendor['status'], 'success' | 'warning' | 'danger'> = {
  active: 'success', inactive: 'warning', suspended: 'danger',
};

export function VendorsView() {
  const { data: vendors, isLoading, error, refetch } = useQuery({ queryKey: ['vendors'], queryFn: vendorsService.getAll });

  if (isLoading) return <Skeleton rows={5} />;
  if (error) return <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load'} onRetry={() => void refetch()} />;
  if (!vendors?.length) return <EmptyState title="No vendors yet" icon="🏭" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-[var(--font-display)]">Vendors</h2>
        <Button size="sm">+ Add Vendor</Button>
      </div>
      <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-sunken)] border-b border-[var(--color-border)]">
            <tr>{['Name','Email','Phone','Specialty','Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {vendors.map(v => (
              <tr key={v._id} className="hover:bg-[var(--color-surface-sunken)] transition-colors">
                <td className="px-4 py-3 font-medium">{v.name}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{v.email}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{v.phone}</td>
                <td className="px-4 py-3 capitalize text-[var(--color-muted)]">{v.specialty}</td>
                <td className="px-4 py-3"><Badge variant={statusVariant[v.status]}>{v.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
