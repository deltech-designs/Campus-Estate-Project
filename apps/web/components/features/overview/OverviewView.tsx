'use client';
import { StatCard, ErrorMessage } from '@/components/ui/StatCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { propertiesService } from '@/services/properties.service';
import { tenantsService } from '@/services/tenants.service';
import { paymentsService } from '@/services/payments.service';
import { maintenanceService } from '@/services/maintenance.service';

export function OverviewView() {
  const properties = useQuery({ queryKey: ['properties'], queryFn: propertiesService.getAll });
  const tenants    = useQuery({ queryKey: ['tenants'],    queryFn: tenantsService.getAll });
  const payments   = useQuery({ queryKey: ['payments'],   queryFn: paymentsService.getAll });
  const maintenance = useQuery({ queryKey: ['maintenance'], queryFn: maintenanceService.getAll });

  const isLoading = properties.isLoading || tenants.isLoading || payments.isLoading || maintenance.isLoading;
  const isError   = properties.isError   || tenants.isError   || payments.isError   || maintenance.isError;

  if (isLoading) return <CardSkeleton count={4} />;
  if (isError)   return <ErrorMessage message="Failed to load overview data" />;

  const occupied = (properties.data ?? []).filter(p => p.status === 'occupied').length;
  const overdue  = (payments.data ?? []).filter(p => p.status === 'overdue').length;
  const openMaint = (maintenance.data ?? []).filter(m => m.status === 'open').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-[var(--font-display)] text-[var(--color-foreground)] mb-1">Dashboard Overview</h2>
        <p className="text-sm text-[var(--color-muted)]">Live summary of your estate portfolio</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Properties" value={properties.data?.length ?? 0} icon="🏠" />
        <StatCard title="Active Tenants" value={tenants.data?.length ?? 0} icon="👥" />
        <StatCard title="Occupied Units" value={occupied} icon="✅" trend={{ value: `${Math.round((occupied / (properties.data?.length || 1)) * 100)}% occupancy`, positive: true }} />
        <StatCard title="Overdue Payments" value={overdue} icon="⚠️" />
        <StatCard title="Open Maintenance" value={openMaint} icon="🔧" />
      </div>
    </div>
  );
}
