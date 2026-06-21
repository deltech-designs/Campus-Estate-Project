'use client';
import { useQuery } from '@tanstack/react-query';
import { staffService } from '@/services/staff.service';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/partials/Badge';
import { Button } from '@/components/partials/Button';
import { Avatar } from '@/components/partials/Avatar';
import { fullName, formatDate } from '@/lib/utils';
import type { IStaff } from '@ems/shared';

const statusVariant: Record<IStaff['status'], 'success' | 'warning' | 'danger'> = {
  active: 'success', on_leave: 'warning', terminated: 'danger',
};

export function StaffView() {
  const { data: staff, isLoading, error, refetch } = useQuery({ queryKey: ['staff'], queryFn: staffService.getAll });

  if (isLoading) return <Skeleton rows={5} />;
  if (error) return <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load'} onRetry={() => void refetch()} />;
  if (!staff?.length) return <EmptyState title="No staff members yet" icon="👔" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-[var(--font-display)]">Staff</h2>
        <Button size="sm">+ Add Staff</Button>
      </div>
      <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
            <tr>{['Staff Member','Role','Zone','Hire Date','Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {staff.map(s => (
              <tr key={s._id} className="hover:bg-[var(--color-surface)] transition-colors">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar name={fullName(s.firstName, s.lastName)} size="sm" /><span className="font-medium">{fullName(s.firstName, s.lastName)}</span></div></td>
                <td className="px-4 py-3 capitalize text-[var(--color-muted)]">{s.role.replace('_', ' ')}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{s.estateZone ?? '—'}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{formatDate(s.hireDate)}</td>
                <td className="px-4 py-3"><Badge variant={statusVariant[s.status]}>{s.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
