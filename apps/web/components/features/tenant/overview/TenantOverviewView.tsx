'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { leasesService } from '@/services/leases.service';
import { paymentsService } from '@/services/payments.service';
import { maintenanceService } from '@/services/maintenance.service';
import { StatCard, ErrorMessage } from '@/components/ui/StatCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/partials/Badge';
import { Button } from '@/components/partials/Button';
import Link from 'next/link';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { LeaseStatus, PaymentStatus, MaintenanceStatus } from '@ems/shared';
import { Home, CreditCard, Wrench, ChevronRight, CalendarDays, Clock } from 'lucide-react';

const leaseStatusVariant: Record<LeaseStatus, 'success' | 'danger' | 'info' | 'neutral'> = {
  active: 'success',
  expired: 'danger',
  terminated: 'danger',
  renewed: 'info',
};

const paymentStatusVariant: Record<PaymentStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  paid: 'success',
  partial: 'warning',
  overdue: 'danger',
  pending: 'neutral',
};

const maintenanceStatusVariant: Record<
  MaintenanceStatus,
  'success' | 'warning' | 'danger' | 'neutral' | 'info'
> = {
  open: 'neutral',
  assigned: 'info',
  in_progress: 'warning',
  completed: 'success',
  closed: 'success',
};

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function TenantOverviewView() {
  const { user } = useAuth();

  const leasesQuery = useQuery({ queryKey: ['leases'], queryFn: leasesService.getAll });
  const paymentsQuery = useQuery({ queryKey: ['payments'], queryFn: paymentsService.getAll });
  const maintenanceQuery = useQuery({ queryKey: ['maintenance'], queryFn: maintenanceService.getAll });

  const isLoading = leasesQuery.isLoading || paymentsQuery.isLoading || maintenanceQuery.isLoading;
  const isError = leasesQuery.isError || paymentsQuery.isError || maintenanceQuery.isError;

  if (isLoading) return <CardSkeleton count={3} />;
  if (isError) return <ErrorMessage message="Failed to load your overview data" />;

  const leases = leasesQuery.data ?? [];
  const payments = paymentsQuery.data ?? [];
  const maintenance = maintenanceQuery.data ?? [];

  // For a tenant, show their active lease (first active one)
  const activeLease = leases.find((l) => l.status === 'active') ?? leases[0] ?? null;

  // Outstanding payments
  const outstanding = payments.filter((p) => p.status === 'pending' || p.status === 'overdue');
  const totalOutstanding = outstanding.reduce((sum, p) => sum + p.amount, 0);
  const nextDue = outstanding.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  )[0];

  // Open maintenance tickets
  const openTickets = maintenance.filter(
    (m) => m.status !== 'completed' && m.status !== 'closed',
  );

  // Lease days remaining
  const leaseEndDays = activeLease ? daysUntil(activeLease.endDate) : null;
  const leaseEndWarning = leaseEndDays !== null && leaseEndDays <= 30 && leaseEndDays > 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
          Welcome back, {user?.firstName} 👋
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Here&apos;s a snapshot of your estate account
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Lease Status"
          value={activeLease ? activeLease.status : 'No Lease'}
          icon="🏠"
        />
        <StatCard
          title="Outstanding Balance"
          value={totalOutstanding > 0 ? formatCurrency(totalOutstanding) : '₦0'}
          icon="💳"
        />
        <StatCard
          title="Open Maintenance Tickets"
          value={openTickets.length}
          icon="🔧"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lease summary card */}
        <div className="lg:col-span-2 bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-primary-light)] flex items-center justify-center">
                <Home size={18} className="text-[var(--color-primary)]" />
              </div>
              <h2 className="text-base font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
                My Lease Summary
              </h2>
            </div>
            <Link href="/tenants/my-lease">
              <Button variant="secondary" size="sm" className="gap-1">
                View Full Details <ChevronRight size={14} />
              </Button>
            </Link>
          </div>

          {activeLease ? (
            <div className="space-y-4">
              {/* Lease status */}
              <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
                <span className="text-sm text-[var(--color-muted)]">Lease Status</span>
                <Badge variant={leaseStatusVariant[activeLease.status]}>
                  {activeLease.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
                <span className="text-sm text-[var(--color-muted)]">Monthly Rent</span>
                <span className="text-sm font-semibold text-[var(--color-foreground)]">
                  {formatCurrency(activeLease.monthlyRent)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
                <span className="text-sm text-[var(--color-muted)]">Lease Period</span>
                <span className="text-sm font-semibold text-[var(--color-foreground)]">
                  {formatDate(activeLease.startDate)} → {formatDate(activeLease.endDate)}
                </span>
              </div>

              {/* Expiry countdown */}
              {leaseEndDays !== null && (
                <div
                  className={[
                    'flex items-center gap-3 p-3 rounded-[var(--radius-md)] text-sm',
                    leaseEndWarning
                      ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]'
                      : leaseEndDays < 0
                        ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]'
                        : 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
                  ].join(' ')}
                >
                  <Clock size={16} />
                  {leaseEndDays < 0
                    ? `Lease expired ${Math.abs(leaseEndDays)} day(s) ago`
                    : leaseEndDays === 0
                      ? 'Lease expires today'
                      : `${leaseEndDays} day(s) remaining on your lease`}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="text-4xl mb-3">🏠</span>
              <p className="text-sm font-medium text-[var(--color-foreground)]">No active lease found</p>
              <p className="text-xs text-[var(--color-muted)] mt-1">
                Contact your estate manager to set up your lease.
              </p>
            </div>
          )}
        </div>

        {/* Quick actions panel */}
        <div className="space-y-4">
          {/* Next payment due */}
          <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-primary-light)] flex items-center justify-center">
                <CreditCard size={18} className="text-[var(--color-primary)]" />
              </div>
              <h3 className="text-sm font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
                Next Payment
              </h3>
            </div>

            {nextDue ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-muted)]">Amount Due</span>
                  <span className="text-base font-bold text-[var(--color-foreground)]">
                    {formatCurrency(nextDue.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-muted)]">Due Date</span>
                  <span className="text-xs font-semibold text-[var(--color-foreground)]">
                    {formatDate(nextDue.dueDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-muted)]">Status</span>
                  <Badge variant={paymentStatusVariant[nextDue.status]}>{nextDue.status}</Badge>
                </div>
                <Link href="/tenants/payments" className="block pt-2">
                  <Button variant="primary" size="sm" className="w-full">
                    Pay Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <span className="text-2xl">✅</span>
                <p className="text-xs text-[var(--color-muted)] mt-2">No outstanding payments</p>
              </div>
            )}
          </div>

          {/* Maintenance snapshot */}
          <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-primary-light)] flex items-center justify-center">
                  <Wrench size={18} className="text-[var(--color-primary)]" />
                </div>
                <h3 className="text-sm font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
                  Maintenance
                </h3>
              </div>
              <Link href="/tenants/maintenance">
                <span className="text-xs text-[var(--color-primary)] font-medium hover:underline cursor-pointer">
                  View all →
                </span>
              </Link>
            </div>

            {openTickets.length > 0 ? (
              <div className="space-y-2">
                {openTickets.slice(0, 3).map((m) => (
                  <div
                    key={m._id}
                    className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0"
                  >
                    <span className="text-xs text-[var(--color-foreground)] truncate max-w-[120px]">
                      {m.title}
                    </span>
                    <Badge variant={maintenanceStatusVariant[m.status]}>
                      {m.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
                {openTickets.length > 3 && (
                  <p className="text-xs text-[var(--color-muted)] pt-1">
                    +{openTickets.length - 3} more ticket(s)
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <span className="text-2xl">🎉</span>
                <p className="text-xs text-[var(--color-muted)] mt-2">No open maintenance tickets</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent payment history strip */}
      {payments.length > 0 && (
        <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
              Recent Transactions
            </h3>
            <Link href="/tenants/payments">
              <Button variant="secondary" size="sm" className="gap-1">
                Full History <ChevronRight size={14} />
              </Button>
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-sunken)]">
              <tr>
                {['Ref #', 'Amount', 'Due Date', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {payments.slice(0, 4).map((p) => (
                <tr key={p._id} className="hover:bg-[var(--color-surface-sunken)]/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-[var(--color-muted)]">
                    #{p._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[var(--color-foreground)]">
                    {formatCurrency(p.amount)}
                  </td>
                  <td className="px-5 py-3.5 text-[var(--color-text-secondary)]">
                    {formatDate(p.dueDate)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={paymentStatusVariant[p.status]}>{p.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
