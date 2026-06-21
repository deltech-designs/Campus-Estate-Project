'use client';
import { useState } from 'react';
import { useProperties } from './use-properties';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/partials/Button';
import { Badge } from '@/components/partials/Badge';
import type { IProperty } from '@ems/shared';

const statusVariant: Record<IProperty['status'], 'success' | 'warning' | 'danger' | 'neutral'> = {
  available:   'success',
  occupied:    'info',
  maintenance: 'warning',
  inactive:    'neutral',
};

export function PropertiesView() {
  const { properties, isLoading, error, refetch, remove } = useProperties();
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemove = async (id: string) => {
    if (!confirm('Delete this property?')) return;
    setRemoving(id);
    try { await remove(id); } finally { setRemoving(null); }
  };

  if (isLoading) return <Skeleton rows={6} />;
  if (error)     return <ErrorMessage message={error} onRetry={() => void refetch()} />;
  if (properties.length === 0) return (
    <EmptyState title="No properties yet" description="Add your first property to get started." icon="🏠" />
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-[var(--font-display)]">Properties</h2>
        <Button size="sm">+ Add Property</Button>
      </div>
      <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
            <tr>
              {['Title', 'Type', 'Zone', 'Rent', 'Bedrooms', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {properties.map(p => (
              <tr key={p._id} className="hover:bg-[var(--color-surface)] transition-colors">
                <td className="px-4 py-3 font-medium text-[var(--color-foreground)]">{p.title}</td>
                <td className="px-4 py-3 text-[var(--color-muted)] capitalize">{p.type}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{p.estateZone}</td>
                <td className="px-4 py-3 font-medium">₦{p.rentAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">{p.bedrooms}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[p.status] as 'success' | 'warning' | 'danger' | 'neutral' | 'info'}>{p.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="danger" size="sm" loading={removing === p._id} onClick={() => void handleRemove(p._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
