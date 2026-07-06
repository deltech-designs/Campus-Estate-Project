'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/partials/Input';
import { Button } from '@/components/partials/Button';
import { Modal } from '@/components/partials/Modal';
import { ShieldCheck, Building2, Users2, Landmark, ArrowLeft } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function LoginView() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = `${API}/api/auth/google?role=tenant`;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setError(null);
      const loggedInUser = await login(values.email, values.password);
      if (loggedInUser.role === 'tenant') {
        router.push('/tenants');
      } else if (loggedInUser.role === 'admin') {
        router.push('/admin/overview');
      } else if (loggedInUser.role === 'manager') {
        router.push('/manager/overview');
      } else {
        router.push('/overview');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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

      {/* Right Column: Login Form */}
      <div className="flex-1 bg-[var(--color-surface)] p-6 sm:p-12 md:p-16 flex items-center justify-center relative overflow-hidden">
        {/* Ambient Glows on light background */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[var(--color-primary)]/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group self-start"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Home
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-[var(--font-display)] text-[var(--color-text-primary)] tracking-tight">
                Welcome back
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1.5">
                Please enter your credentials to log in to the system.
              </p>
            </div>
          </div>

          {/* Form Content Card */}
          <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] p-6 sm:p-8 shadow-[var(--shadow-card)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-[var(--color-border)] transition-all duration-300">
            {error && (
              <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-600 animate-pulse-subtle">
                {error}
              </div>
            )}

            {/* Google Login */}
            <Button
              type="button"
              variant="secondary"
              loading={googleLoading}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 mb-6 border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-sunken)] hover:border-emerald-500/20 text-[var(--color-text-primary)] font-semibold rounded-[var(--radius-btn)] transition-all duration-150"
            >
              {!googleLoading && (
                <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 0, 0)">
                    <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.99,2.37 -2.1,3.12v2.6h3.39c1.98,-1.82 3.12,-4.5 3.12,-7.58C21.79,11.66 21.63,11.23 21.35,11.1z" fill="#4285F4" />
                    <path d="M12,21c2.43,0 4.47,-0.81 5.96,-2.18l-3.39,-2.6c-0.94,0.63 -2.14,1.0 -3.57,1.0 -2.75,0 -5.07,-1.86 -5.9,-4.35H1.61v2.69C3.1,18.52 7.23,21 12,21z" fill="#34A853" />
                    <path d="M6.1,12.87c-0.22,-0.66 -0.35,-1.37 -0.35,-2.1c0,-0.73 0.13,-1.44 0.35,-2.1V5.98H1.61c-0.73,1.46 -1.15,3.1 -1.15,4.79s0.42,3.33 1.15,4.79l4.49,-2.69z" fill="#FBBC05" />
                    <path d="M12,5.77c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.47,3.13 14.43,2.27 12,2.27c-4.77,0 -8.9,2.48 -10.39,5.71l4.49,2.69C6.93,8.19 9.25,5.77 12,5.77z" fill="#EA4335" />
                  </g>
                </svg>
              )}
              Sign in with Google
            </Button>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-[var(--color-border)]"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--color-surface-raised)] px-3 text-[var(--color-text-secondary)] font-semibold tracking-wide">
                  Or sign in with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@estate.com"
                error={errors.email?.message}
                {...register('email')}
                className="bg-[var(--color-surface-sunken)] border-[var(--color-border)] focus:ring-[var(--color-primary)]/25 py-2.5 rounded-[var(--radius-md)]"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
                className="bg-[var(--color-surface-sunken)] border-[var(--color-border)] focus:ring-[var(--color-primary)]/25 py-2.5 rounded-[var(--radius-md)]"
              />

              <div className="flex justify-between items-center text-xs mt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[var(--color-text-secondary)] group">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-[var(--color-primary)] focus:ring-0 focus:ring-offset-0 cursor-pointer transition-colors"
                  />
                  <span className="group-hover:text-[var(--color-text-primary)] transition-colors">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                className="mt-3 w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-md shadow-primary/10 font-semibold rounded-[var(--radius-btn)] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg active:shadow-md transition-all duration-150"
              >
                Sign In
              </Button>
            </form>

            {/* Redirection */}
            <p className="text-center text-xs text-[var(--color-text-secondary)] mt-6 pt-4 border-t border-[var(--color-border)]">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:underline transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
