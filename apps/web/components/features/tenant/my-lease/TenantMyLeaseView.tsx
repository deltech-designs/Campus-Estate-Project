'use client';

import { useQuery } from '@tanstack/react-query';
import { leasesService } from '@/services/leases.service';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/StatCard';
import { Badge } from '@/components/partials/Badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { LeaseStatus } from '@ems/shared';
import {
  Home,
  CalendarDays,
  Clock,
  BadgeCheck,
  Banknote,
  ShieldCheck,
  RefreshCw,
  Info,
} from 'lucide-react';

const leaseStatusVariant: Record<LeaseStatus, 'success' | 'danger' | 'info' | 'neutral'> = {
  active: 'success',
  expired: 'danger',
  terminated: 'danger',
  renewed: 'info',
};

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const color =
    clamped > 60
      ? 'var(--color-success)'
      : clamped > 20
        ? 'var(--color-warning)'
        : 'var(--color-danger)';
  return (
    <div className="w-full bg-[var(--color-surface-sunken)] rounded-full h-2.5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

function DetailRow({ label, value, icon }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between py-3.5 border-b border-[var(--color-border)] last:border-0">
      <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
        {icon && <span className="text-[var(--color-primary)]">{icon}</span>}
        {label}
      </div>
      <div className="text-sm font-semibold text-[var(--color-foreground)] text-right">{value}</div>
    </div>
  );
}

export function TenantMyLeaseView() {
  const { data: leases, isLoading, error, refetch } = useQuery({
    queryKey: ['leases'],
    queryFn: leasesService.getAll,
  });

  if (isLoading) return <Skeleton rows={8} />;
  if (error)
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : 'Failed to load lease details'}
        onRetry={() => void refetch()}
      />
    );

  const lease = (leases ?? []).find((l) => l.status === 'active') ?? (leases ?? [])[0] ?? null;

  if (!lease) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">🏠</span>
        <h2 className="text-lg font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
          No Lease Found
        </h2>
        <p className="text-sm text-[var(--color-muted)] mt-2 max-w-sm">
          You do not have an active lease agreement on record. Please contact your estate manager.
        </p>
      </div>
    );
  }

  const daysLeft = daysUntil(lease.endDate);
  const totalDays = Math.ceil(
    (new Date(lease.endDate).getTime() - new Date(lease.startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const daysElapsed = totalDays - daysLeft;
  const progressPercent = Math.max(0, Math.min(100, (daysLeft / totalDays) * 100));

  const isExpiringSoon = daysLeft > 0 && daysLeft <= 30;
  const isExpired = daysLeft <= 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
          My Lease Agreement
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Read-only view of your current tenancy agreement
        </p>
      </div>

      {/* Expiry banner */}
      {isExpiringSoon && !isExpired && (
        <div className="flex items-center gap-3 p-4 bg-[var(--color-warning-bg)] border border-[var(--color-warning)]/30 rounded-[var(--radius-lg)] text-[var(--color-warning)]">
          <Clock size={20} className="shrink-0" />
          <div>
            <p className="text-sm font-semibold">Lease Expiring Soon</p>
            <p className="text-xs mt-0.5">
              Your lease expires in <strong>{daysLeft} day(s)</strong> on{' '}
              {formatDate(lease.endDate)}. Contact your manager about renewal.
            </p>
          </div>
        </div>
      )}
      {isExpired && (
        <div className="flex items-center gap-3 p-4 bg-[var(--color-danger-bg)] border border-[var(--color-danger)]/30 rounded-[var(--radius-lg)] text-[var(--color-danger)]">
          <Info size={20} className="shrink-0" />
          <div>
            <p className="text-sm font-semibold">Lease Has Expired</p>
            <p className="text-xs mt-0.5">
              This lease expired on {formatDate(lease.endDate)}. Please contact your estate manager
              immediately.
            </p>
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lease details card */}
        <div className="lg:col-span-2 bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary-light)] flex items-center justify-center">
                <Home size={20} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <h2 className="text-base font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
                  Tenancy Agreement Details
                </h2>
                <p className="text-xs text-[var(--color-muted)]">
                  Lease ID:{' '}
                  <span className="font-mono">#{lease._id.slice(-10).toUpperCase()}</span>
                </p>
              </div>
            </div>
            <Badge variant={leaseStatusVariant[lease.status]}>{lease.status}</Badge>
          </div>

          <div>
            <DetailRow
              label="Start Date"
              value={formatDate(lease.startDate)}
              icon={<CalendarDays size={15} />}
            />
            <DetailRow
              label="End Date"
              value={formatDate(lease.endDate)}
              icon={<CalendarDays size={15} />}
            />
            <DetailRow
              label="Monthly Rent"
              value={formatCurrency(lease.monthlyRent)}
              icon={<Banknote size={15} />}
            />
            <DetailRow
              label="Security Deposit"
              value={formatCurrency(lease.securityDeposit)}
              icon={<ShieldCheck size={15} />}
            />
            <DetailRow
              label="Renewal Status"
              value={
                lease.renewalNotified ? (
                  <Badge variant="info">Renewal Notified</Badge>
                ) : (
                  <Badge variant="neutral">Not Renewed</Badge>
                )
              }
              icon={<RefreshCw size={15} />}
            />
            <DetailRow
              label="Lease Registered"
              value={formatDate(lease.createdAt)}
              icon={<BadgeCheck size={15} />}
            />
          </div>
        </div>

        {/* Lease countdown panel */}
        <div className="space-y-4">
          {/* Progress card */}
          <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-5">
            <h3 className="text-sm font-bold font-[var(--font-display)] text-[var(--color-foreground)] mb-4">
              Lease Duration
            </h3>

            <div className="text-center mb-5">
              <p
                className="text-4xl font-bold font-[var(--font-display)]"
                style={{
                  color: isExpired
                    ? 'var(--color-danger)'
                    : isExpiringSoon
                      ? 'var(--color-warning)'
                      : 'var(--color-success)',
                }}
              >
                {isExpired ? `${Math.abs(daysLeft)}` : daysLeft}
              </p>
              <p className="text-xs text-[var(--color-muted)] mt-1">
                {isExpired ? 'days since expiry' : 'days remaining'}
              </p>
            </div>

            <ProgressBar percent={progressPercent} />

            <div className="flex justify-between text-xs text-[var(--color-muted)] mt-2">
              <span>{daysElapsed > 0 ? daysElapsed : 0} days elapsed</span>
              <span>{totalDays} days total</span>
            </div>
          </div>

          {/* Financial summary card */}
          <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-5">
            <h3 className="text-sm font-bold font-[var(--font-display)] text-[var(--color-foreground)] mb-4">
              Financial Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--color-muted)]">Monthly Rent</span>
                <span className="text-sm font-bold text-[var(--color-foreground)]">
                  {formatCurrency(lease.monthlyRent)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--color-muted)]">Security Deposit</span>
                <span className="text-sm font-bold text-[var(--color-foreground)]">
                  {formatCurrency(lease.securityDeposit)}
                </span>
              </div>
              <div className="pt-3 border-t border-[var(--color-border)]">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">
                    Total Commitment
                  </span>
                  <span className="text-base font-bold text-[var(--color-primary)]">
                    {formatCurrency(
                      lease.monthlyRent * Math.ceil(totalDays / 30) + lease.securityDeposit,
                    )}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--color-muted)] mt-1">
                  Based on lease period + deposit
                </p>
              </div>
            </div>
          </div>

          {/* Notice box */}
          <div className="p-4 bg-[var(--color-info-bg)] border border-[var(--color-info)]/20 rounded-[var(--radius-md)]">
            <p className="text-xs text-[var(--color-info)] leading-relaxed">
              This is a read-only view of your tenancy agreement. For changes or renewals, please
              contact your estate manager directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
