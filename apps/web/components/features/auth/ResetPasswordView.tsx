'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/partials/Input';
import { Button } from '@/components/partials/Button';
import { ShieldCheck, Building2, Users2, Landmark, ArrowLeft, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ['confirmPassword'],
});
type FormValues = z.infer<typeof schema>;

export function ResetPasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    if (!token) {
      setError('Reset token is missing. Please request a new link.');
      return;
    }

    try {
      setError(null);
      await authService.resetPassword({ token, password: values.password });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex flex-col md:flex-row">
      {/* Left Column: Platform Branding and Stats */}
      <div className="hidden md:flex md:w-[42%] bg-gradient-to-br from-[var(--color-sidebar-bg)] via-[var(--color-sidebar-bg)] to-indigo-950/80 p-8 md:p-12 flex-col justify-between text-white relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Ambient Glows */}
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl animate-pulse-subtle" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[var(--color-primary)]/15 blur-3xl animate-float-delayed" />
        <div className="absolute left-1/3 top-1/3 w-60 h-60 rounded-full bg-emerald-500/5 blur-3xl" />

        {/* Brand / Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center font-bold text-lg text-white shadow-md shadow-[var(--color-primary)]/20 group-hover:scale-105 transition-transform duration-300">
              E
            </div>
            <span className="font-[var(--font-display)] font-bold text-lg tracking-tight hover:text-[var(--color-primary-light)] transition-colors">
              CampusEstate
            </span>
          </Link>
        </div>

        {/* Copy & Metrics */}
        <div className="my-auto py-12 relative z-10 max-w-md">
          <h2 className="text-3xl md:text-4xl font-extrabold font-[var(--font-display)] tracking-tight leading-tight mb-4">
            Unified platform for <span className="text-[var(--color-primary-light)]">campus estate</span> management.
          </h2>
          <p className="text-sm text-[var(--color-sidebar-text)] leading-relaxed mb-8">
            Access CEMS to manage residential properties, track leases, automate rental invoices, and coordinate facility repairs.
          </p>

          {/* Quick Metrics grid */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
            {/* Metric 1 */}
            <div className="group/card p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300">
              <div className="flex items-center gap-2 text-[var(--color-primary-light)] mb-1">
                <Building2 size={16} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-sidebar-text)] group-hover/card:text-white transition-colors">Properties</span>
              </div>
              <p className="text-2xl font-bold font-[var(--font-display)]">500+</p>
              <p className="text-[11px] text-[var(--color-sidebar-text)] mt-0.5 leading-normal">Verified hostel buildings</p>
            </div>

            {/* Metric 2 */}
            <div className="group/card p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300">
              <div className="flex items-center gap-2 text-[var(--color-primary-light)] mb-1">
                <Users2 size={16} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-sidebar-text)] group-hover/card:text-white transition-colors">Tenants</span>
              </div>
              <p className="text-2xl font-bold font-[var(--font-display)]">1,800+</p>
              <p className="text-[11px] text-[var(--color-sidebar-text)] mt-0.5 leading-normal">Active students & faculty</p>
            </div>

            {/* Metric 3 */}
            <div className="group/card p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300">
              <div className="flex items-center gap-2 text-[var(--color-primary-light)] mb-1">
                <Landmark size={16} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-sidebar-text)] group-hover/card:text-white transition-colors">Rent Rates</span>
              </div>
              <p className="text-2xl font-bold font-[var(--font-display)]">99.2%</p>
              <p className="text-[11px] text-[var(--color-sidebar-text)] mt-0.5 leading-normal">On-time collections</p>
            </div>

            {/* Metric 4 */}
            <div className="group/card p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300">
              <div className="flex items-center gap-2 text-[var(--color-primary-light)] mb-1">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-sidebar-text)] group-hover/card:text-white transition-colors">Security</span>
              </div>
              <p className="text-2xl font-bold font-[var(--font-display)]">100%</p>
              <p className="text-[11px] text-[var(--color-sidebar-text)] mt-0.5 leading-normal">Verified landlord KYC</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[11px] text-[var(--color-sidebar-text)]">
          &copy; {new Date().getFullYear()} CampusEstate CEMS. All rights reserved.
        </div>
      </div>

      {/* Right Column: Reset Password Form */}
      <div className="flex-1 bg-[var(--color-surface)] p-6 sm:p-12 md:p-16 flex items-center justify-center relative overflow-hidden">
        {/* Ambient Glows on light background */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[var(--color-primary)]/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group self-start"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to sign in
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-[var(--font-display)] text-[var(--color-text-primary)] tracking-tight">
                Reset password
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1.5">
                Set a strong password to protect your account.
              </p>
            </div>
          </div>

          {/* Form Content Card */}
          <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] p-6 sm:p-8 shadow-[var(--shadow-card)] border border-[var(--color-border)] transition-all duration-300">
            {error && (
              <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-600">
                {error}
              </div>
            )}

            {!token ? (
              <div className="flex flex-col text-left py-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 text-red-600 mb-4 self-start">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-2">Invalid or missing token</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  The password reset link is invalid or incomplete. Please go back to the Forgot Password screen and request a new link.
                </p>
                <Link
                  href="/forgot-password"
                  className="mt-6 inline-flex items-center justify-center py-2.5 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold rounded-[var(--radius-btn)] transition-colors"
                >
                  Request a new link
                </Link>
              </div>
            ) : !success ? (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-1">
                  <KeyRound size={22} />
                </div>

                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                  className="bg-[var(--color-surface-sunken)] border-[var(--color-border)] focus:ring-[var(--color-primary)]/25 py-2.5 rounded-[var(--radius-md)]"
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                  className="bg-[var(--color-surface-sunken)] border-[var(--color-border)] focus:ring-[var(--color-primary)]/25 py-2.5 rounded-[var(--radius-md)]"
                />

                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="mt-3 w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-md font-semibold rounded-[var(--radius-btn)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                >
                  Reset Password
                </Button>
              </form>
            ) : (
              <div className="flex flex-col text-left py-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 mb-4 self-start">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-2">Password reset successful</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Your password has been successfully updated. You can now use your new credentials to sign in.
                </p>
                <Link
                  href="/login"
                  className="mt-6 inline-flex items-center justify-center py-2.5 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold rounded-[var(--radius-btn)] transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
