'use client';

import { useState } from 'react';
import { useProperties } from './use-properties';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/partials/Button';
import { Badge } from '@/components/partials/Badge';
import { Modal } from '@/components/partials/Modal';
import { Input } from '@/components/partials/Input';
import { Select } from '@/components/partials/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { IProperty, PropertyType, PropertyStatus, ICreatePropertyPayload } from '@ems/shared';
import { Phone, Mail, Home, User, DollarSign, MapPin } from 'lucide-react';

const statusVariant: Record<PropertyStatus, 'success' | 'warning' | 'danger' | 'neutral' | 'info'> = {
  available:   'success',
  occupied:    'info',
  maintenance: 'warning',
  inactive:    'neutral',
};

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  type: z.enum(['apartment', 'duplex', 'commercial', 'land'] as const),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  rentAmount: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: 'Rent must be a number' }).min(1, 'Rent must be greater than 0')
  ),
  bedrooms: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: 'Bedrooms must be a number' }).min(0)
  ),
  estateZone: z.string().min(1, 'Zone is required'),
});

type FormValues = z.infer<typeof formSchema>;

export function PropertiesView() {
  const { user } = useAuth();
  const { properties, isLoading, error, refetch, create, remove } = useProperties();
  const [removing, setRemoving] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<IProperty | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleOpenAdd = () => {
    setEditingProperty(null);
    reset({ title: '', type: 'apartment', address: '', rentAmount: 0, bedrooms: 1, estateZone: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: IProperty) => {
    setEditingProperty(p);
    setValue('title', p.title);
    setValue('type', p.type);
    setValue('address', p.address);
    setValue('rentAmount', p.rentAmount);
    setValue('bedrooms', p.bedrooms);
    setValue('estateZone', p.estateZone);
    setIsModalOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (editingProperty) {
        // Mock update
        // (Just recreate/refetch or log for now, since we have mock support in useProperties)
        alert('Property updated successfully (mock)');
      } else {
        await create({
          ...values,
          amenities: ['Power Generator', 'Water Supply', 'Security Gate'],
        });
      }
      setIsModalOpen(false);
      reset();
    } catch (err) {
      console.error(err);
      alert('Action failed');
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Delete this property unit permanently?')) return;
    setRemoving(id);
    try {
      await remove(id);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    } finally {
      setRemoving(null);
    }
  };

  if (isLoading) return <Skeleton rows={6} />;
  if (error) return <ErrorMessage message={error} onRetry={() => void refetch()} />;

  // ─── TENANT VIEW ──────────────────────────────────────────────────────────
  if (user?.role === 'tenant') {
    const rented = properties.find(p => p.status === 'occupied') || properties[0];

    if (!rented) {
      return (
        <EmptyState
          title="No rented property found"
          description="Your account is not currently assigned to any active lease."
          icon="🏠"
        />
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display)] text-[var(--color-foreground)] mb-1">My Rented Property</h2>
          <p className="text-sm text-[var(--color-muted)]">Details and specifications of your current residence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Card */}
          <div className="md:col-span-2 bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-hidden hover:shadow-md hover:border-[var(--color-primary)]/10 transition-all duration-300">
            {/* Header image mock */}
            <div className="h-48 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-sidebar-hover)] flex items-center justify-center text-white relative">
              <div className="absolute top-4 right-4">
                <Badge variant="success">Occupied</Badge>
              </div>
              <Home size={64} className="opacity-80" />
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-foreground)] font-[var(--font-display)] mb-1">{rented.title}</h3>
                <p className="text-sm text-[var(--color-muted)] flex items-center gap-1">
                  <MapPin size={14} /> {rented.address} • Zone: {rented.estateZone}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-[var(--color-border)] text-center">
                <div>
                  <p className="text-xs text-[var(--color-muted)]">Type</p>
                  <p className="font-semibold text-[var(--color-foreground)] capitalize">{rented.type}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-muted)]">Bedrooms</p>
                  <p className="font-semibold text-[var(--color-foreground)]">{rented.bedrooms}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-muted)]">Monthly Rent</p>
                  <p className="font-bold text-[var(--color-primary)]">₦{rented.rentAmount.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-[var(--color-foreground)] mb-2">Amenities Included</h4>
                <div className="flex flex-wrap gap-2">
                  {(rented.amenities || ['Water Supply', 'Power Backup', '24/7 Security']).map((am, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] font-medium rounded-full">
                      ✓ {am}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Landlord Contact Info */}
          <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-6 space-y-6 flex flex-col justify-between hover:shadow-md hover:border-[var(--color-primary)]/10 transition-all duration-300">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--color-foreground)] font-[var(--font-display)]">Estate Contact Details</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)]">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-muted)]">Assigned Landlord</p>
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">Mrs. Janet Alabi</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)]">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-muted)]">Phone Number</p>
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">+234 803 111 2222</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)]">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-muted)]">Email Address</p>
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">janet.alabi@ems.edu.ng</p>
                </div>
              </div>
            </div>

            <Button variant="secondary" className="w-full" onClick={() => window.location.href = '/chat'}>
              Open Conversation Chat
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── ADMIN & LANDLORD VIEWS ───────────────────────────────────────────────
  const isManager = user?.role === 'manager';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display)]">{isManager ? 'My Managed Properties' : 'Global Estate Registry'}</h2>
          <p className="text-sm text-[var(--color-muted)]">{isManager ? 'Manage your own estate assets and rental details' : 'Platform-wide oversight of all real estate properties'}</p>
        </div>
        {isManager && (
          <Button size="sm" onClick={handleOpenAdd}>
            + Add Property
          </Button>
        )}
      </div>

      {properties.length === 0 ? (
        <EmptyState title="No properties yet" description="Add your first property unit to get started." icon="🏠" />
      ) : (
        <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-sunken)] border-b border-[var(--color-border)]">
              <tr>
                {['Title', 'Type', 'Zone', 'Rent Amount', 'Bedrooms', 'Status', ''].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {properties.map((p) => (
                <tr key={p._id} className="hover:bg-[var(--color-surface-sunken)]/50 transition-colors">
                  <td className="px-5 py-4 font-bold text-[var(--color-foreground)]">{p.title}</td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)] capitalize">{p.type}</td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)]">{p.estateZone}</td>
                  <td className="px-5 py-4 font-semibold text-[var(--color-foreground)]">₦{p.rentAmount.toLocaleString()}</td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)]">{p.bedrooms}</td>
                  <td className="px-5 py-4">
                    <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    {isManager && (
                      <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(p)}>
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      loading={removing === p._id}
                      onClick={() => void handleRemove(p._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProperty ? 'Edit Property Unit' : 'Create Property Unit'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Property Title" {...register('title')} error={errors.title?.message} placeholder="e.g. Apartment 4B - Oak Lodge" />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--color-foreground)] mb-1 block">Property Type</label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
              >
                <option value="apartment">Apartment</option>
                <option value="duplex">Duplex</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </select>
            </div>
            <Input label="Estate Zone" {...register('estateZone')} error={errors.estateZone?.message} placeholder="e.g. Zone B" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Monthly Rent (₦)" type="number" {...register('rentAmount')} error={errors.rentAmount?.message} placeholder="e.g. 250000" />
            <Input label="Bedrooms Count" type="number" {...register('bedrooms')} error={errors.bedrooms?.message} placeholder="e.g. 2" />
          </div>

          <Input label="Address" {...register('address')} error={errors.address?.message} placeholder="e.g. 12 University Road, Yaba" />

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {editingProperty ? 'Save Changes' : 'Create Unit'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
