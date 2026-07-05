'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceService } from '@/services/maintenance.service';
import { vendorsService } from '@/services/vendors.service';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/partials/Badge';
import { Button } from '@/components/partials/Button';
import { Modal } from '@/components/partials/Modal';
import { Input } from '@/components/partials/Input';
import { formatDate } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { IMaintenanceRequest, MaintenancePriority, MaintenanceStatus } from '@ems/shared';
import { Wrench, CheckCircle, Clock, Hammer, ShieldCheck, User, Calendar, Plus } from 'lucide-react';

const priorityVariant: Record<MaintenancePriority, 'success' | 'warning' | 'danger' | 'neutral'> = {
  low: 'neutral',
  medium: 'warning',
  high: 'danger',
  urgent: 'danger',
};

const statusVariant: Record<MaintenanceStatus, 'success' | 'warning' | 'danger' | 'neutral' | 'info'> = {
  open: 'neutral',
  assigned: 'info',
  in_progress: 'warning',
  completed: 'success',
  closed: 'success',
};

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Please provide a detailed description'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
  propertyId: z.string().min(1, 'Property ID is required'),
});

type FormValues = z.infer<typeof formSchema>;

export function MaintenanceView() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: items, isLoading, error, refetch } = useQuery({
    queryKey: ['maintenance'],
    queryFn: maintenanceService.getAll,
  });

  const { data: vendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: vendorsService.getAll,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<IMaintenanceRequest | null>(null);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { priority: 'medium', propertyId: 'mock_prop_id' },
  });

  // Submit request mutation
  const createMutation = useMutation({
    mutationFn: async (payload: FormValues) => {
      const API = process.env.NEXT_PUBLIC_API_URL!;
      const res = await fetch(`${API}/api/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, status: 'open' }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });

  // Update status/vendor mutation
  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; status: MaintenanceStatus; vendorId?: string }) => {
      const API = process.env.NEXT_PUBLIC_API_URL!;
      const res = await fetch(`${API}/api/maintenance/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });

  if (isLoading) return <Skeleton rows={6} />;
  if (error) return <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load'} onRetry={() => void refetch()} />;

  const requestList = items ?? [];

  const handleOpenAdd = () => {
    reset({ title: '', description: '', priority: 'medium', propertyId: 'mock_prop_id' });
    setIsAddModalOpen(true);
  };

  const handleCreateRequest = async (values: FormValues) => {
    try {
      await createMutation.mutateAsync(values);
      setIsAddModalOpen(false);
      reset();
    } catch (err) {
      console.error(err);
      alert('Failed to submit maintenance request');
    }
  };

  const handleAssignContractor = async () => {
    if (!activeRequest || !selectedVendor) return;
    setIsAssigning(true);
    try {
      await updateMutation.mutateAsync({
        id: activeRequest._id,
        status: 'assigned',
        vendorId: selectedVendor,
      });
      setActiveRequest(null);
    } catch (err) {
      console.error(err);
      alert('Assignment failed');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUpdateStatus = async (status: MaintenanceStatus) => {
    if (!activeRequest) return;
    try {
      await updateMutation.mutateAsync({
        id: activeRequest._id,
        status,
      });
      setActiveRequest(null);
    } catch (err) {
      console.error(err);
      alert('Status update failed');
    }
  };

  const isTenant = user?.role === 'tenant';

  // Wizard Steps mapping
  const steps = [
    { label: 'Lodged', status: 'open', desc: 'Request registered' },
    { label: 'Assigned', status: 'assigned', desc: 'Contractor assigned' },
    { label: 'In Progress', status: 'in_progress', desc: 'Repair started' },
    { label: 'Completed', status: 'completed', desc: 'Resolved and closed' },
  ];

  const getStepIndex = (status: MaintenanceStatus) => {
    if (status === 'open') return 0;
    if (status === 'assigned') return 1;
    if (status === 'in_progress') return 2;
    if (status === 'completed' || status === 'closed') return 3;
    return 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display)]">Maintenance & Fault Reports</h2>
          <p className="text-sm text-[var(--color-muted)]">Track repair tasks and report campus facility faults</p>
        </div>
        {isTenant && (
          <Button size="sm" onClick={handleOpenAdd}>
            <Plus size={16} className="mr-1 shrink-0" /> Lodge Fault Report
          </Button>
        )}
      </div>

      {requestList.length === 0 ? (
        <EmptyState title="No maintenance requests" description="No logged faults or requests found." icon="🔧" />
      ) : (
        <div className="bg-white rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-sunken)] border-b border-[var(--color-border)]">
              <tr>
                {['Title', 'Priority', 'Status', 'Date Lodged', ''].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {requestList.map((m) => (
                <tr key={m._id} className="hover:bg-[var(--color-surface-sunken)]/50 transition-colors">
                  <td className="px-5 py-4 font-bold text-[var(--color-foreground)]">{m.title}</td>
                  <td className="px-5 py-4">
                    <Badge variant={priorityVariant[m.priority]}>{m.priority}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={statusVariant[m.status]}>{m.status.replace('_', ' ')}</Badge>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)]">{formatDate(m.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <Button variant="secondary" size="sm" onClick={() => {
                      setActiveRequest(m);
                      setSelectedVendor(m.vendorId || '');
                    }}>
                      {isTenant ? 'Track Request' : 'Manage Ticket'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lodge Request Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Lodge Facility Fault Report"
      >
        <form onSubmit={handleSubmit(handleCreateRequest)} className="space-y-4">
          <Input label="Fault Summary / Title" {...register('title')} error={errors.title?.message} placeholder="e.g. Toilet flush not working" />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--color-foreground)] mb-1 block">Fault Category</label>
              <select className="w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="structural">Structural/Masonry</option>
                <option value="appliance">Appliance repair</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-foreground)] mb-1 block">Priority Urgency</label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="low">Low (General Query)</option>
                <option value="medium">Medium (Repair Needed)</option>
                <option value="high">High (Disruptive Fault)</option>
                <option value="urgent">Urgent (Safety/Security Hazard)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--color-foreground)]">Detailed Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Provide context, location details, or specific symptoms..."
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            {errors.description?.message && <p className="text-xs text-[var(--color-danger)]">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Submit Report
            </Button>
          </div>
        </form>
      </Modal>

      {/* Tracker / Manager Modal */}
      <Modal
        isOpen={!!activeRequest}
        onClose={() => setActiveRequest(null)}
        title={isTenant ? 'Complaint Progress Tracker' : 'Manage Maintenance Ticket'}
        size="lg"
      >
        {activeRequest && (
          <div className="space-y-6">
            <div className="bg-[var(--color-surface-sunken)] p-4 rounded-lg">
              <h3 className="font-bold text-sm text-[var(--color-foreground)] mb-1">{activeRequest.title}</h3>
              <p className="text-xs text-[var(--color-muted)] mb-3">Report Ref: #{activeRequest._id.toUpperCase()} • Priority: {activeRequest.priority.toUpperCase()}</p>
              <p className="text-sm text-[var(--color-foreground)] leading-relaxed bg-white p-3 rounded border border-[var(--color-border)]">{activeRequest.description}</p>
            </div>

            {/* Step Wizard Progress tracker */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Progress Tracker</h4>
              <div className="relative">
                {/* Connector line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-[var(--color-border)] z-0" />
                <div
                  className="absolute top-4 left-4 h-0.5 bg-[var(--color-primary)] transition-all duration-300 z-0"
                  style={{ width: `${(getStepIndex(activeRequest.status) / 3) * 100}%` }}
                />

                <div className="grid grid-cols-4 relative z-10">
                  {steps.map((st, i) => {
                    const activeIndex = getStepIndex(activeRequest.status);
                    const isDone = i <= activeIndex;
                    const isCurrent = i === activeIndex;

                    return (
                      <div key={st.status} className="flex flex-col items-center text-center">
                        <div
                          className={[
                            'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all font-semibold text-xs',
                            isDone
                              ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                              : 'bg-white border-[var(--color-border)] text-[var(--color-text-disabled)]',
                            isCurrent ? 'ring-4 ring-[var(--color-primary)]/20 scale-110' : '',
                          ].join(' ')}
                        >
                          {isDone ? '✓' : i + 1}
                        </div>
                        <span className={`text-xs font-bold mt-2 ${isDone ? 'text-[var(--color-foreground)]' : 'text-[var(--color-text-disabled)]'}`}>{st.label}</span>
                        <span className="text-[10px] text-[var(--color-muted)] hidden sm:block mt-0.5">{st.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contractor / Landlord Management actions */}
            {!isTenant && (
              <div className="border-t border-[var(--color-border)] pt-4 space-y-4">
                <h4 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Administrative Controls</h4>
                
                {/* Assign Vendor */}
                {activeRequest.status === 'open' && (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
                    <div className="flex-1">
                      <label className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1 block">Assign Contractor</label>
                      <select
                        value={selectedVendor}
                        onChange={(e) => setSelectedVendor(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      >
                        <option value="">-- Choose Vendor --</option>
                        {vendors?.map((v) => (
                          <option key={v._id} value={v._id}>{v.name} ({v.specialty})</option>
                        ))}
                      </select>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAssignContractor}
                      loading={isAssigning}
                      disabled={!selectedVendor}
                    >
                      Assign Vendor
                    </Button>
                  </div>
                )}

                {/* Progress Status Select */}
                {activeRequest.status !== 'open' && (
                  <div className="flex flex-wrap gap-2 justify-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200"
                      onClick={() => handleUpdateStatus('in_progress')}
                      disabled={activeRequest.status === 'in_progress'}
                    >
                      Set In-Progress
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                      onClick={() => handleUpdateStatus('completed')}
                      disabled={activeRequest.status === 'completed' || activeRequest.status === 'closed'}
                    >
                      Mark Resolved
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-[var(--color-border)]">
              <Button variant="secondary" onClick={() => setActiveRequest(null)}>
                Close Viewer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
