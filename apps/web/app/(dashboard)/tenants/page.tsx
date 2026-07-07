'use client';

import { useAuth } from '@/context/AuthContext';
import { TenantOverviewView } from '@/components/features/tenant/overview/TenantOverviewView';
import { TenantsView } from '@/components/features/tenants/TenantsView';
import { Skeleton } from '@/components/ui/Skeleton';

export default function TenantsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Skeleton rows={6} />;
  }

  if (user?.role === 'tenant') {
    return <TenantOverviewView />;
  }

  return <TenantsView />;
}
