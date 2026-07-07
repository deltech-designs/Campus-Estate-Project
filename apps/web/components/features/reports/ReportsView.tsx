'use client';

import { useState } from 'react';
import { Button } from '@/components/partials/Button';
import { Badge } from '@/components/partials/Badge';
import { BarChart3, Download, TrendingUp, Calendar, Building2, Filter, DollarSign, Wrench, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function ReportsView() {
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedRange, setSelectedRange] = useState('month');

  // Mock data for analytics
  const metrics = [
    { label: 'Total Revenue Collected', value: '₦4,850,000', change: '+12.4% vs last month', positive: true, icon: DollarSign, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
    { label: 'Occupancy Rate', value: '88%', change: '+3% increase', positive: true, icon: Building2, color: 'text-blue-500 bg-blue-50 border-blue-100' },
    { label: 'Maintenance Cost Spent', value: '₦620,000', change: '-4.2% less than budget', positive: true, icon: Wrench, color: 'text-amber-500 bg-amber-50 border-amber-100' },
    { label: 'Avg Ticket Resolution', value: '1.8 Days', change: '-12h faster resolution', positive: true, icon: TrendingUp, color: 'text-violet-500 bg-violet-50 border-violet-100' }
  ];

  const zonePerformance = [
    { zone: 'Zone A (Main Campus)', occupancy: '94%', revenue: 1850000, compliance: '98%', status: 'optimal' },
    { zone: 'Zone B (Staff Quarters)', occupancy: '86%', revenue: 1420000, compliance: '92%', status: 'optimal' },
    { zone: 'Zone C (Hostels)', occupancy: '90%', revenue: 1580000, compliance: '96%', status: 'optimal' },
    { zone: 'Zone D (Commercial Units)', occupancy: '65%', revenue: 0, compliance: '88%', status: 'warning' },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display)] text-[var(--color-foreground)]">Platform Analytics & Reports</h2>
          <p className="text-sm text-[var(--color-muted)]">Real-time occupancy metrics, financial audits, and maintenance logs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2">
            <Download size={14} /> Export CSV
          </Button>
          <Button variant="primary" size="sm" className="gap-2 shadow-[0_4px_12px_var(--color-primary)/0.15]">
            <Download size={14} /> Generate PDF Report
          </Button>
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 self-start md:self-auto text-sm font-semibold text-[var(--color-foreground)]">
          <Filter size={16} className="text-[var(--color-primary)]" />
          <span>Quick Filters:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Zone Selector */}
          <div className="flex-1 md:flex-initial">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full md:w-48 px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
            >
              <option value="all">All Estate Zones</option>
              <option value="zone_a">Zone A (Main Campus)</option>
              <option value="zone_b">Zone B (Staff Quarters)</option>
              <option value="zone_c">Zone C (Hostels)</option>
              <option value="zone_d">Zone D (Commercial)</option>
            </select>
          </div>
          {/* Timeframe Selector */}
          <div className="flex-1 md:flex-initial">
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="w-full md:w-40 px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
            >
              <option value="week">Past Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">Full Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-card)] hover:shadow-md hover:border-[var(--color-primary)]/10 transition-all duration-300 flex items-center justify-between"
            >
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">{item.label}</p>
                <p className="text-2xl font-bold text-[var(--color-foreground)] font-[var(--font-display)]">{item.value}</p>
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                  {item.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color} shrink-0`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Occupancy and Revenues Chart Mock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mock Chart Area */}
        <div className="lg:col-span-2 bg-[var(--color-surface-raised)] border border-[var(--color-border)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] hover:shadow-md hover:border-[var(--color-primary)]/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold font-[var(--font-display)] text-[var(--color-foreground)]">Rent Revenue Analysis</h3>
              <p className="text-xs text-[var(--color-muted)]">Monthly cashflow summary of collections vs arrears</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] inline-block" /> Collected</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--color-info)] inline-block" /> Target</span>
            </div>
          </div>
          {/* Chart bars mock */}
          <div className="h-56 flex items-end justify-between gap-6 pt-4 border-b border-[var(--color-border)] pb-2 px-4">
            {[
              { label: 'Jan', val: 70, target: 80 },
              { label: 'Feb', val: 78, target: 80 },
              { label: 'Mar', val: 82, target: 90 },
              { label: 'Apr', val: 90, target: 90 },
              { label: 'May', val: 85, target: 95 },
              { label: 'Jun', val: 95, target: 100 },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                <div className="w-full flex items-end gap-1.5 h-full max-w-[40px]">
                  {/* Revenue bar */}
                  <div
                    style={{ height: `${bar.val}%` }}
                    className="flex-1 bg-gradient-to-t from-[var(--color-primary-hover)] to-[var(--color-primary)] rounded-t-sm group-hover:opacity-85 transition-opacity"
                    title={`Collected: ₦${(bar.val * 20000).toLocaleString()}`}
                  />
                  {/* Target bar */}
                  <div
                    style={{ height: `${bar.target}%` }}
                    className="w-1.5 bg-[var(--color-info)] opacity-40 rounded-t-sm"
                  />
                </div>
                <span className="text-[10px] font-bold text-[var(--color-muted)] mt-2">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Alert System panel */}
        <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] hover:shadow-md hover:border-[var(--color-primary)]/10 transition-all duration-300 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-[var(--font-display)] text-[var(--color-foreground)] mb-2">Audit Notifications</h3>
            <p className="text-xs text-[var(--color-muted)] mb-4">Required compliance revisions for platforms</p>
            <div className="space-y-3">
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Unsigned Leases Detected</p>
                  <p className="opacity-90">There are 3 expired lease agreements in Zone B.</p>
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2.5 text-xs text-amber-800">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Pending Audits</p>
                  <p className="opacity-90">Zone D Commercial properties require status updates.</p>
                </div>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="w-full text-xs mt-4">
            Run Verification Check
          </Button>
        </div>
      </div>

      {/* Zone Performance Table */}
      <div className="space-y-4">
        <h3 className="text-base font-bold font-[var(--font-display)] text-[var(--color-foreground)]">Estate Zones Metrics Breakdown</h3>
        <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-sunken)] border-b border-[var(--color-border)]">
              <tr>
                {['Estate Zone', 'Occupancy Rate', 'Rent Collected', 'Maintenance SLA Rate', 'Compliance Status'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {zonePerformance.map((item, i) => (
                <tr key={i} className="hover:bg-[var(--color-surface-sunken)]/30 transition-colors">
                  <td className="px-5 py-4 font-bold text-[var(--color-foreground)]">{item.zone}</td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)]">{item.occupancy}</td>
                  <td className="px-5 py-4 font-semibold text-[var(--color-foreground)]">
                    {item.revenue > 0 ? `₦${item.revenue.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)]">{item.compliance}</td>
                  <td className="px-5 py-4">
                    <Badge variant={item.status === 'optimal' ? 'success' : 'warning'}>
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
