'use client';

import { StatCard, ErrorMessage } from '@/components/ui/StatCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { propertiesService } from '@/services/properties.service';
import { tenantsService } from '@/services/tenants.service';
import { paymentsService } from '@/services/payments.service';
import { maintenanceService } from '@/services/maintenance.service';
import { Button } from '@/components/partials/Button';
import { Badge } from '@/components/partials/Badge';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

export function OverviewView() {
  const { user } = useAuth();
  
  const propertiesQuery = useQuery({ queryKey: ['properties'], queryFn: propertiesService.getAll });
  const tenantsQuery    = useQuery({ queryKey: ['tenants'],    queryFn: tenantsService.getAll });
  const paymentsQuery   = useQuery({ queryKey: ['payments'],   queryFn: paymentsService.getAll });
  const maintenanceQuery = useQuery({ queryKey: ['maintenance'], queryFn: maintenanceService.getAll });

  const isLoading = propertiesQuery.isLoading || tenantsQuery.isLoading || paymentsQuery.isLoading || maintenanceQuery.isLoading;
  const isError   = propertiesQuery.isError   || tenantsQuery.isError   || paymentsQuery.isError   || maintenanceQuery.isError;

  if (isLoading) return <CardSkeleton count={4} />;
  if (isError)   return <ErrorMessage message="Failed to load overview data" />;

  const properties = propertiesQuery.data ?? [];
  const tenants    = tenantsQuery.data ?? [];
  const payments   = paymentsQuery.data ?? [];
  const maintenance = maintenanceQuery.data ?? [];

  if (user?.role === 'admin') {
    // ─── ADMIN DASHBOARD ───────────────────────────────────────────────────────
    const occupied = properties.filter(p => p.status === 'occupied').length;
    const occupancyRate = properties.length > 0 ? Math.round((occupied / properties.length) * 100) : 0;
    const totalCollected = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const activeMaintenance = maintenance.filter(m => m.status !== 'completed' && m.status !== 'closed').length;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display)] text-[var(--color-foreground)] mb-1">
            System Administration Overview
          </h2>
          <p className="text-sm text-[var(--color-muted)]">Global metrics and system performance monitor</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Properties" value={properties.length} icon="🏠" />
          <StatCard title="Total Tenants" value={tenants.length} icon="👥" />
          <StatCard title="Total Revenue" value={`₦${totalCollected.toLocaleString()}`} icon="💳" />
          <StatCard title="Active Maintenance" value={activeMaintenance} icon="🔧" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)]">
            <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-4">Platform Occupancy Details</h3>
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-4">
              <div>
                <p className="text-sm text-[var(--color-muted)]">Occupancy Rate</p>
                <p className="text-2xl font-bold text-[var(--color-foreground)]">{occupancyRate}%</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-[var(--color-primary)] flex items-center justify-center font-bold text-sm">
                {occupied}/{properties.length}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--color-muted)]">Available Units</span>
                <span className="font-semibold text-emerald-600">{properties.filter(p => p.status === 'available').length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--color-muted)]">Units Under Maintenance</span>
                <span className="font-semibold text-amber-600">{properties.filter(p => p.status === 'maintenance').length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--color-muted)]">Inactive/Suspended Units</span>
                <span className="font-semibold text-rose-600">{properties.filter(p => p.status === 'inactive').length}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-3">System Actions</h3>
              <p className="text-xs text-[var(--color-muted)] mb-4">Quick shortcuts to manage platform estates</p>
            </div>
            <div className="space-y-2.5">
              <Link href="/properties" className="block w-full text-center py-2.5 px-4 rounded-[var(--radius-btn)] border border-[var(--color-border)] hover:bg-[var(--color-surface-sunken)] hover:border-[var(--color-primary)]/30 text-sm font-semibold transition-all">
                Add New Estate Unit
              </Link>
              <Link href="/staff" className="block w-full text-center py-2.5 px-4 rounded-[var(--radius-btn)] border border-[var(--color-border)] hover:bg-[var(--color-surface-sunken)] hover:border-[var(--color-primary)]/30 text-sm font-semibold transition-all">
                Configure Staff Accounts
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === 'manager') {
    // ─── LANDLORD DASHBOARD ────────────────────────────────────────────────────
    const myProperties = properties; // Mock ownership
    const myTenantsCount = tenants.length;
    const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
    const activeComplaints = maintenance.filter(m => m.status === 'open' || m.status === 'assigned');

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display)] text-[var(--color-foreground)] mb-1">
            Landlord Portfolio Overview
          </h2>
          <p className="text-sm text-[var(--color-muted)]">Portfolio metrics, complaints and payment statuses</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="My Properties" value={myProperties.length} icon="🏡" />
          <StatCard title="Active Occupants" value={myTenantsCount} icon="👤" />
          <StatCard title="Rent Collected" value={`₦${totalPayments.toLocaleString()}`} icon="💰" />
          <StatCard title="Open Complaints" value={activeComplaints.length} icon="⚠️" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Complaints list */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[var(--color-foreground)]">Recent Tenant Complaints</h3>
              <Link href="/maintenance" className="text-xs text-[var(--color-primary)] hover:underline font-semibold">View all</Link>
            </div>
            {activeComplaints.length > 0 ? (
              <div className="divide-y divide-[var(--color-border)]">
                {activeComplaints.slice(0, 3).map((item) => (
                  <div key={item._id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-[var(--color-foreground)]">{item.title}</p>
                      <p className="text-xs text-[var(--color-muted)]">Created on {formatDate(item.createdAt)}</p>
                    </div>
                    <Badge variant={item.priority === 'urgent' || item.priority === 'high' ? 'danger' : 'warning'}>
                      {item.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-muted)] py-6 text-center">No active tenant complaints</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-2">Portfolio Management</h3>
              <p className="text-xs text-[var(--color-muted)] mb-4">Perform actions on your units</p>
            </div>
            <div className="space-y-2">
              <Link href="/properties" className="block w-full text-center py-2 px-4 rounded-[var(--radius-btn)] border border-[var(--color-border)] hover:bg-[var(--color-surface-sunken)] text-xs font-semibold transition-all">
                Manage Property Units
              </Link>
              <Link href="/leases" className="block w-full text-center py-2 px-4 rounded-[var(--radius-btn)] border border-[var(--color-border)] hover:bg-[var(--color-surface-sunken)] text-xs font-semibold transition-all">
                Prepare Lease Agreement
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── TENANT DASHBOARD ──────────────────────────────────────────────────────
  const rentedProperty = properties.find(p => p.status === 'occupied') || properties[0];
  const pendingRent = payments.find(p => p.status === 'pending' || p.status === 'overdue');
  const myComplaints = maintenance.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-[var(--font-display)] text-[var(--color-foreground)] mb-1">
          Welcome to CampusEstate, Tenant
        </h2>
        <p className="text-sm text-[var(--color-muted)]">Manage your rent, file maintenance requests, and check statuses</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="My Rented Home" value={rentedProperty ? rentedProperty.title : 'No active property'} icon="🏠" />
        <StatCard title="Outstanding Rent" value={pendingRent ? `₦${pendingRent.amount.toLocaleString()}` : '₦0'} icon="💳" />
        <StatCard title="Fault Reports Filed" value={myComplaints} icon="🔧" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rented Property Info */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)]">
          <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-4">My Lease & Rent Status</h3>
          {rentedProperty ? (
            <div className="space-y-4">
              <div className="p-4 bg-[var(--color-surface-sunken)] rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[var(--color-foreground)]">{rentedProperty.title}</h4>
                  <p className="text-xs text-[var(--color-muted)]">{rentedProperty.address} • Zone: {rentedProperty.estateZone}</p>
                </div>
                <Badge variant="success">Active Lease</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm border-t border-[var(--color-border)] pt-4">
                <div>
                  <p className="text-xs text-[var(--color-muted)]">Monthly Rent Amount</p>
                  <p className="font-bold text-[var(--color-foreground)]">₦{rentedProperty.rentAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-muted)]">Next Payment Due Date</p>
                  <p className="font-bold text-[var(--color-foreground)]">{pendingRent ? formatDate(pendingRent.dueDate) : 'No pending dues'}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[var(--color-muted)] py-6 text-center">No active lease documents found</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-2">Tenant Services</h3>
            <p className="text-xs text-[var(--color-muted)] mb-4">Access tenant portal functions directly</p>
          </div>
          <div className="space-y-2">
            <Link href="/maintenance" className="block w-full text-center py-2.5 px-4 rounded-[var(--radius-btn)] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] text-sm font-semibold transition-all">
              File a Fault Report
            </Link>
            <Link href="/payments" className="block w-full text-center py-2.5 px-4 rounded-[var(--radius-btn)] border border-[var(--color-border)] hover:bg-[var(--color-surface-sunken)] text-sm font-semibold transition-all">
              View Payment Receipts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
