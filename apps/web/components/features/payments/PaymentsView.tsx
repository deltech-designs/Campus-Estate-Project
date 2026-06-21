'use client';
import { useQuery } from '@tanstack/react-query';
import { paymentsService } from '@/services/payments.service';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/partials/Badge';
import { Button } from '@/components/partials/Button';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { IPayment } from '@ems/shared';

const statusVariant: Record<IPayment['status'], 'success' | 'warning' | 'danger' | 'neutral'> = {
  paid: 'success', partial: 'warning', overdue: 'danger', pending: 'neutral',
};

export function PaymentsView() {
  const { data: payments, isLoading, error, refetch } = useQuery({ queryKey: ['payments'], queryFn: paymentsService.getAll });

  if (isLoading) return <Skeleton rows={6} />;
  if (error) return <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load'} onRetry={() => void refetch()} />;
  if (!payments?.length) return <EmptyState title="No payments yet" icon="💳" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-[var(--font-display)]">Payments</h2>
        <Button size="sm">+ Record Payment</Button>
      </div>
      <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
            <tr>{['Amount','Due Date','Paid Date','Method','Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {payments.map(p => (
              <tr key={p._id} className="hover:bg-[var(--color-surface)] transition-colors">
                <td className="px-4 py-3 font-medium">{formatCurrency(p.amount)}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{formatDate(p.dueDate)}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{p.paidDate ? formatDate(p.paidDate) : '—'}</td>
                <td className="px-4 py-3 text-[var(--color-muted)] capitalize">{p.method ?? '—'}</td>
                <td className="px-4 py-3"><Badge variant={statusVariant[p.status]}>{p.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
