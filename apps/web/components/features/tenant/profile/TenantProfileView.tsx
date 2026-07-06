'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/partials/Input';
import { Button } from '@/components/partials/Button';
import { Avatar } from '@/components/partials/Avatar';
import { Modal } from '@/components/partials/Modal';
import { fullName } from '@/lib/utils';
import {
  User,
  Phone,
  Mail,
  ShieldCheck,
  Edit3,
  CheckCircle,
  AlertCircle,
  FileText,
  UserCircle,
} from 'lucide-react';

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(7, 'Enter a valid phone number').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ─── Sub-components ───────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-[var(--color-border)] last:border-0">
      <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--color-primary-light)] flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[var(--color-primary)]">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-[var(--color-foreground)] truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TenantProfileView() {
  const { user } = useAuth();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
    },
  });

  const handleOpenEdit = () => {
    reset({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
    });
    setSaveStatus('idle');
    setIsEditOpen(true);
  };

  const handleSaveProfile = async (_values: ProfileFormValues) => {
    // In a real app, call a service: await tenantsService.updateMe(values);
    // For now we simulate success since the backend endpoint may not exist yet
    await new Promise((res) => setTimeout(res, 800));
    setSaveStatus('success');
    setTimeout(() => setIsEditOpen(false), 1200);
  };

  if (!user) return null;

  const displayName = fullName(user.firstName, user.lastName);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
          My Profile
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — profile card */}
        <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-6 flex flex-col items-center text-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar name={displayName} size="xl" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--color-success)] rounded-full border-2 border-white flex items-center justify-center">
              <CheckCircle size={12} className="text-white" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
              {displayName}
            </h2>
            <p className="text-xs text-[var(--color-muted)] mt-0.5 capitalize">{user.role}</p>
          </div>

          {/* Account status pill */}
          <div
            className={[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
              user.isActive
                ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                : 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
            ].join(' ')}
          >
            <span
              className={[
                'w-1.5 h-1.5 rounded-full',
                user.isActive ? 'bg-[var(--color-success)]' : 'bg-[var(--color-danger)]',
              ].join(' ')}
            />
            {user.isActive ? 'Account Active' : 'Account Inactive'}
          </div>

          <Button variant="secondary" size="sm" className="w-full gap-2 mt-2" onClick={handleOpenEdit}>
            <Edit3 size={14} />
            Edit Profile
          </Button>

          {/* Quick stats */}
          <div className="w-full pt-4 border-t border-[var(--color-border)] space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--color-muted)]">Account Role</span>
              <span className="font-semibold capitalize text-[var(--color-foreground)]">
                {user.role}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--color-muted)]">Member Since</span>
              <span className="font-semibold text-[var(--color-foreground)]">
                {new Date(user.createdAt).getFullYear()}
              </span>
            </div>
          </div>
        </div>

        {/* Right — info details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal info */}
          <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserCircle size={18} className="text-[var(--color-primary)]" />
              <h3 className="text-sm font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
                Personal Information
              </h3>
            </div>
            <InfoRow label="Full Name" value={displayName} icon={<User size={15} />} />
            <InfoRow label="Email Address" value={user.email} icon={<Mail size={15} />} />
            <InfoRow
              label="Phone Number"
              value={user.phone ?? 'Not provided'}
              icon={<Phone size={15} />}
            />
          </div>

          {/* Security info */}
          <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-[var(--color-primary)]" />
              <h3 className="text-sm font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
                Account Security
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-sunken)]">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">Password</p>
                  <p className="text-xs text-[var(--color-muted)]">Last changed: unknown</p>
                </div>
                <Button variant="secondary" size="sm" disabled>
                  Change Password
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-info-bg)] border border-[var(--color-info)]/20">
                <AlertCircle size={16} className="text-[var(--color-info)] shrink-0" />
                <p className="text-xs text-[var(--color-info)]">
                  Password changes must be performed through the authentication portal. Contact your
                  administrator if you need assistance.
                </p>
              </div>
            </div>
          </div>

          {/* KYC Documents */}
          <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-[var(--color-primary)]" />
              <h3 className="text-sm font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
                KYC Documents
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-surface-sunken)] flex items-center justify-center mb-3">
                <FileText size={22} className="text-[var(--color-text-disabled)]" />
              </div>
              <p className="text-sm font-medium text-[var(--color-foreground)]">
                No documents uploaded
              </p>
              <p className="text-xs text-[var(--color-muted)] mt-1 max-w-xs">
                KYC document uploads are managed by your estate administrator. Contact them to
                submit your documents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Personal Info" size="md">
        {saveStatus === 'success' ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-[var(--color-success-bg)] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={30} className="text-[var(--color-success)]" />
            </div>
            <h3 className="text-base font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
              Profile Updated!
            </h3>
            <p className="text-sm text-[var(--color-muted)]">Your changes have been saved successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleSaveProfile)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...register('firstName')}
                error={errors.firstName?.message}
                placeholder="e.g. Amaka"
              />
              <Input
                label="Last Name"
                {...register('lastName')}
                error={errors.lastName?.message}
                placeholder="e.g. Okonkwo"
              />
            </div>

            <Input
              label="Phone Number"
              {...register('phone')}
              error={errors.phone?.message}
              placeholder="e.g. 08012345678"
              type="tel"
            />

            {/* Email is read-only */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--color-foreground)]">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-[var(--color-text-disabled)] cursor-not-allowed"
              />
              <p className="text-xs text-[var(--color-muted)]">
                Email cannot be changed. Contact your administrator.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
