'use client';

import { useState } from 'react';
import { Button } from '@/components/partials/Button';
import { Input } from '@/components/partials/Input';
import { 
  Building, 
  Wrench, 
  CreditCard, 
  ShieldAlert, 
  Save, 
  CheckCircle,
  Database,
  Sliders,
  BellRing
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'maintenance' | 'finance' | 'security'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'CampusEstate Pro',
    institution: 'University of Ibadan',
    contactEmail: 'estate-office@ui.edu.ng',
    contactPhone: '+234 803 123 4567',
    defaultZones: 'Zone A (Residential), Zone B (Academic), Zone C (Staff Quarters)'
  });

  const [maintenanceSettings, setMaintenanceSettings] = useState({
    targetResponseHours: '24',
    autoAssignContractors: true,
    maxBudgetWithoutApproval: '150000',
    notifyOnEscalation: true
  });

  const [financeSettings, setFinanceSettings] = useState({
    rentDueDay: '1',
    gracePeriodDays: '5',
    lateFeePercentage: '5',
    currency: 'NGN (₦)'
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '60',
    enforceMfa: false,
    backupFrequency: 'daily',
    allowedDomain: 'ui.edu.ng'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface-raised)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--color-primary-light)] rounded-lg text-[var(--color-primary)]">
            <Sliders size={24} className="animate-[pulse_3s_infinite]" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-[var(--font-display)] text-[var(--color-foreground)]">System Settings</h2>
            <p className="text-sm text-[var(--color-muted)]">Configure global estate parameters, maintenance, and policy controls</p>
          </div>
        </div>
        
        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-semibold animate-fade-in">
            <CheckCircle size={16} />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'general'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] bg-[var(--color-surface-raised)] hover:bg-[var(--color-surface-sunken)] border border-[var(--color-border)]'
            }`}
          >
            <Building size={18} />
            <span>General Profile</span>
          </button>
          
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'maintenance'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] bg-[var(--color-surface-raised)] hover:bg-[var(--color-surface-sunken)] border border-[var(--color-border)]'
            }`}
          >
            <Wrench size={18} />
            <span>Maintenance Policy</span>
          </button>
          
          <button
            onClick={() => setActiveTab('finance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'finance'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] bg-[var(--color-surface-raised)] hover:bg-[var(--color-surface-sunken)] border border-[var(--color-border)]'
            }`}
          >
            <CreditCard size={18} />
            <span>Financial & Rent</span>
          </button>
          
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'security'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] bg-[var(--color-surface-raised)] hover:bg-[var(--color-surface-sunken)] border border-[var(--color-border)]'
            }`}
          >
            <ShieldAlert size={18} />
            <span>Security & Backups</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSave} className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-6 space-y-6">
            
            {/* General Profile Section */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold font-[var(--font-display)] text-[var(--color-foreground)] mb-1">General System Profile</h3>
                  <p className="text-xs text-[var(--color-muted)]">Customize the platform identity and institutional setup</p>
                </div>
                <hr className="border-[var(--color-border)]" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">System Display Name</label>
                    <input 
                      type="text" 
                      value={generalSettings.systemName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, systemName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Institution / Organization</label>
                    <input 
                      type="text" 
                      value={generalSettings.institution}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, institution: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Primary Contact Email</label>
                    <input 
                      type="email" 
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Estate Helpdesk Phone</label>
                    <input 
                      type="text" 
                      value={generalSettings.contactPhone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Configured Estate Zones</label>
                  <textarea 
                    rows={2}
                    value={generalSettings.defaultZones}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, defaultZones: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors"
                  />
                  <p className="text-[10px] text-[var(--color-muted)]">Separate multiple campus zones with commas.</p>
                </div>
              </div>
            )}

            {/* Maintenance Policy Section */}
            {activeTab === 'maintenance' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold font-[var(--font-display)] text-[var(--color-foreground)] mb-1">Maintenance & Fault Workflows</h3>
                  <p className="text-xs text-[var(--color-muted)]">Manage default service levels and automated contractor assignments</p>
                </div>
                <hr className="border-[var(--color-border)]" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Target Resolution Period (Hours)</label>
                    <select 
                      value={maintenanceSettings.targetResponseHours}
                      onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, targetResponseHours: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
                    >
                      <option value="12">12 Hours (Fast Track)</option>
                      <option value="24">24 Hours (Next Day)</option>
                      <option value="48">48 Hours (2 Business Days)</option>
                      <option value="72">72 Hours (Standard)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Approval Spending Limit (₦)</label>
                    <input 
                      type="number" 
                      value={maintenanceSettings.maxBudgetWithoutApproval}
                      onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, maxBudgetWithoutApproval: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 bg-[var(--color-surface-sunken)] rounded-lg">
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-foreground)]">Auto-Assign Registered Contractors</h4>
                      <p className="text-xs text-[var(--color-muted)]">Dispatch specialists automatically based on category</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={maintenanceSettings.autoAssignContractors} 
                        onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, autoAssignContractors: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[var(--color-surface-sunken)] rounded-lg">
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-foreground)]">Escalation Notifications</h4>
                      <p className="text-xs text-[var(--color-muted)]">Alert Estate Director when a ticket is overdue</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={maintenanceSettings.notifyOnEscalation} 
                        onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, notifyOnEscalation: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Settings Section */}
            {activeTab === 'finance' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold font-[var(--font-display)] text-[var(--color-foreground)] mb-1">Financial & Billing Settings</h3>
                  <p className="text-xs text-[var(--color-muted)]">Set payment intervals, grace periods, and late penalties</p>
                </div>
                <hr className="border-[var(--color-border)]" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Rent Due Date (Day of Month)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="28" 
                      value={financeSettings.rentDueDay}
                      onChange={(e) => setFinanceSettings({ ...financeSettings, rentDueDay: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Grace Period (Days)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={financeSettings.gracePeriodDays}
                      onChange={(e) => setFinanceSettings({ ...financeSettings, gracePeriodDays: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Late Payment Penalty (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={financeSettings.lateFeePercentage}
                      onChange={(e) => setFinanceSettings({ ...financeSettings, lateFeePercentage: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">System Base Currency</label>
                    <input 
                      type="text" 
                      disabled
                      value={financeSettings.currency}
                      className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-sm text-[var(--color-text-disabled)] opacity-80 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings Section */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold font-[var(--font-display)] text-[var(--color-foreground)] mb-1">Security, Domain & Data Policies</h3>
                  <p className="text-xs text-[var(--color-muted)]">Control session behavior, user registration domains, and system backups</p>
                </div>
                <hr className="border-[var(--color-border)]" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Session Idle Timeout (Minutes)</label>
                    <input 
                      type="number" 
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Allowed Institutional Email Domain</label>
                    <input 
                      type="text" 
                      placeholder="e.g. unibadan.edu.ng"
                      value={securitySettings.allowedDomain}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, allowedDomain: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Automated Database Backups</label>
                    <select 
                      value={securitySettings.backupFrequency}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, backupFrequency: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
                    >
                      <option value="hourly">Every Hour</option>
                      <option value="daily">Every 24 Hours (Daily)</option>
                      <option value="weekly">Every Sunday (Weekly)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between gap-4 mt-2">
                  <div className="flex gap-2">
                    <Database className="text-amber-700 shrink-0" size={20} />
                    <div>
                      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Manual Database Backup</h4>
                      <p className="text-xs text-amber-700 mt-0.5">Download a snapshot of properties, leases and payment records immediately.</p>
                    </div>
                  </div>
                  <Button type="button" variant="secondary" size="sm" className="text-amber-800 border-amber-300 hover:bg-amber-100 bg-white">
                    Backup Now
                  </Button>
                </div>
              </div>
            )}

            {/* Form Actions Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
              <Button type="button" variant="secondary">
                Reset Changes
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting} className="flex items-center gap-2">
                <Save size={16} />
                <span>Save Configuration</span>
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
