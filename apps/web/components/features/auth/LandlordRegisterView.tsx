'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { Input } from '@/components/partials/Input';
import { Button } from '@/components/partials/Button';
import { Modal } from '@/components/partials/Modal';
import { Building2, FileCheck, Landmark, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  email:     z.string().email('Invalid email'),
  phone:     z.string().min(10, 'Phone number must be at least 10 digits'),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
});
type FormValues = z.infer<typeof schema>;

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function LandlordRegisterView() {
  const { register: authRegister } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const [otpRequired, setOtpRequired] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setError(null);
      // Backend expects role 'manager' for landlords
      const res = await authRegister(values.firstName, values.lastName, values.email, values.password, 'manager', values.phone);
      if (res.otpRequired) {
        setRegisteredEmail(values.email);
        setDevOtp(res.otp || null);
        setOtpRequired(true);
      } else {
        router.push('/manager/overview');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setOtpError('Please enter a 6-digit OTP code');
      return;
    }

    try {
      setOtpError(null);
      setOtpVerifying(true);
      await authService.verifyOtp({ email: registeredEmail, code: otpCode });
      window.location.href = '/manager/overview';
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'OTP Verification failed');
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    window.location.href = `${API}/api/auth/google?role=manager`;
  };

  const googleAccounts = [
    { name: 'Alhaji Rasaq', email: 'rasaq.hostels@gmail.com', avatar: 'AR' },
    { name: 'Benson Owner', email: 'benson.estates@gmail.com', avatar: 'BO' },
  ];

  const handleGoogleSelect = async (account: { name: string; email: string }) => {
    setIsGoogleModalOpen(false);
    setGoogleLoading(true);
    setError(null);

    const [firstName = 'Google', lastName = 'User'] = account.name.split(' ');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await authRegister(firstName, lastName, account.email, 'GoogleOAuthPassword123!', 'manager');
      router.push('/manager/overview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google OAuth Registration failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleEmail.includes('@')) return;
    
    const prefix = customGoogleEmail.split('@')[0] || 'google';
    const capitalizedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    
    void handleGoogleSelect({
      name: `${capitalizedName} Google`,
      email: customGoogleEmail,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex flex-col md:flex-row">
      {/* Left Column: Visual Showcase */}
      <div className="hidden md:flex md:w-[45%] bg-[var(--color-sidebar-bg)] p-8 md:p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-[var(--color-primary)]/15 blur-3xl animate-pulse-subtle" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/5 blur-3xl animate-float-delayed" />

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

        {/* Content Section */}
        <div className="my-auto py-12 relative z-10 max-w-md">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] border border-[var(--color-primary-light)]/20 mb-6">
            <UserCheck size={12} /> For Property Owners & Managers
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-[var(--font-display)] tracking-tight leading-tight mb-4">
            Simplify your <span className="text-[var(--color-primary-light)]">estate operations</span>.
          </h2>
          <p className="text-sm text-[var(--color-sidebar-text)] leading-relaxed mb-8">
            List hostel units, track tenants, digitize leases, automate billing, and streamline work orders in one unified system.
          </p>

          {/* Feature List */}
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] flex items-center justify-center shrink-0">
                <Building2 size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold">Listing & Unit Management</p>
                <p className="text-xs text-[var(--color-sidebar-text)] mt-0.5">Publish hostels, manage rooms, occupancy logs, and track vacancies in real time.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] flex items-center justify-center shrink-0">
                <Landmark size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold">Automated Rent Collection</p>
                <p className="text-xs text-[var(--color-sidebar-text)] mt-0.5">Send billing notices, collect rent directly, and generate automated financial statements.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] flex items-center justify-center shrink-0">
                <FileCheck size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold">Vendor Dispatch Workflows</p>
                <p className="text-xs text-[var(--color-sidebar-text)] mt-0.5">Receive issues reported by tenants and seamlessly route them to maintenance contractors.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-[var(--color-sidebar-text)]">
          &copy; {new Date().getFullYear()} CampusEstate CEMS. All rights reserved.
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="flex-1 bg-[var(--color-surface)] p-6 sm:p-12 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-4 group"
            >
              <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
              Back to role selection
            </Link>
            <h1 className="text-2xl font-bold font-[var(--font-display)] text-[var(--color-text-primary)]">
              Create landlord / partner account
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1.5">
              Fill in your details to start managing hostels and properties.
            </p>
          </div>

          {/* Form Content */}
          <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] p-6 sm:p-8 shadow-[var(--shadow-card)] border border-[var(--color-border)]">
            {error && (
              <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-600 animate-pulse-subtle">
                {error}
              </div>
            )}

            {otpRequired ? (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-3">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">Verify your email</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
                    We&apos;ve sent a 6-digit verification code to <span className="font-semibold text-[var(--color-text-primary)]">{registeredEmail}</span>.
                  </p>
                </div>

                {otpError && (
                  <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-600 animate-pulse-subtle">
                    {otpError}
                  </div>
                )}

                <Input
                  label="Verification Code"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="bg-[var(--color-surface-sunken)] border-[var(--color-border)] focus:ring-[var(--color-primary)]/25 py-2.5 rounded-[var(--radius-md)] text-center tracking-[0.5em] text-lg font-bold"
                />

                <Button
                  type="submit"
                  loading={otpVerifying}
                  className="mt-2 w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-[var(--radius-btn)] transition-all duration-150"
                >
                  Verify Code
                </Button>

                <button
                  type="button"
                  onClick={() => setOtpRequired(false)}
                  className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline mt-1 self-center"
                >
                  Back to Registration
                </button>

                {devOtp && (
                  <div className="mt-4 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs flex flex-col gap-1">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-amber-600">Development Helper</span>
                    <p>Use code: <span className="font-bold font-mono text-sm">{devOtp}</span></p>
                  </div>
                )}
              </form>
            ) : (
              <>
                {/* Google Signup */}
                <Button
                  type="button"
                  variant="secondary"
                  loading={googleLoading}
                  onClick={handleGoogleSignup}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-sunken)] hover:border-[var(--color-primary)]/20 text-[var(--color-text-primary)] font-semibold rounded-[var(--radius-btn)] transition-all duration-150"
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
                  Sign up with Google
                </Button>

                {/* Divider */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-[var(--color-border)]"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[var(--color-surface-raised)] px-3 text-[var(--color-text-secondary)] font-semibold tracking-wide">
                      Or register with email
                    </span>
                  </div>
                </div>

                {/* Standard Signup */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First name"
                      placeholder="John"
                      error={errors.firstName?.message}
                      {...register('firstName')}
                      className="bg-[var(--color-surface-sunken)] border-[var(--color-border)] focus:ring-[var(--color-primary)]/25"
                    />
                    <Input
                      label="Last name"
                      placeholder="Doe"
                      error={errors.lastName?.message}
                      {...register('lastName')}
                      className="bg-[var(--color-surface-sunken)] border-[var(--color-border)] focus:ring-[var(--color-primary)]/25"
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="john@estate.com"
                    error={errors.email?.message}
                    {...register('email')}
                    className="bg-[var(--color-surface-sunken)] border-[var(--color-border)] focus:ring-[var(--color-primary)]/25"
                  />
                  <Input
                    label="Phone number"
                    type="tel"
                    placeholder="e.g. 08012345678"
                    error={errors.phone?.message}
                    {...register('phone')}
                    className="bg-[var(--color-surface-sunken)] border-[var(--color-border)] focus:ring-[var(--color-primary)]/25"
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register('password')}
                    className="bg-[var(--color-surface-sunken)] border-[var(--color-border)] focus:ring-[var(--color-primary)]/25"
                  />
                  
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    className="mt-2 w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-md shadow-primary/10 font-semibold rounded-[var(--radius-btn)]"
                  >
                    Sign Up
                  </Button>
                </form>

                {/* Redirection */}
                <p className="text-center text-xs text-[var(--color-text-secondary)] mt-5">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-[var(--color-primary)] hover:underline hover:text-[var(--color-primary-hover)] transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Google Mock Chooser Modal */}
      <Modal
        isOpen={isGoogleModalOpen}
        onClose={() => {
          setIsGoogleModalOpen(false);
          setShowCustomInput(false);
        }}
        title="Sign in with Google"
        size="sm"
      >
        <div className="flex flex-col text-center">
          <div className="mb-4">
            <p className="text-xs text-[var(--color-text-secondary)]">
              Choose a Google account to continue to <span className="font-semibold text-[var(--color-text-primary)]">CampusEstate</span>
            </p>
          </div>

          {!showCustomInput ? (
            <div className="flex flex-col divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-surface)] shadow-sm">
              {googleAccounts.map((acc, index) => (
                <button
                  key={index}
                  onClick={() => handleGoogleSelect(acc)}
                  className="flex items-center gap-3 p-3.5 text-left w-full hover:bg-[var(--color-surface-sunken)] transition-colors duration-150 group"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center transition-transform group-hover:scale-105 duration-150 shrink-0">
                    {acc.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--color-text-primary)] truncate">{acc.name}</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)] truncate">{acc.email}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-[var(--color-text-secondary)] font-medium">Click to select</span>
                  </div>
                </button>
              ))}

              <button
                onClick={() => setShowCustomInput(true)}
                className="flex items-center gap-3 p-3.5 text-left w-full hover:bg-[var(--color-surface-sunken)] transition-colors duration-150 group text-xs font-semibold text-[var(--color-text-secondary)]"
              >
                <div className="w-8 h-8 rounded-full border border-dashed border-[var(--color-border)] flex items-center justify-center text-lg text-[var(--color-text-secondary)] bg-[var(--color-surface-sunken)] shrink-0">
                  +
                </div>
                Use another account
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomGoogleSubmit} className="flex flex-col gap-3">
              <Input
                label="Google Email Address"
                type="email"
                required
                placeholder="username@gmail.com"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                className="bg-[var(--color-surface-sunken)] border-[var(--color-border)]"
              />
              <div className="flex gap-2 justify-end mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomInput(false)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-[var(--radius-btn)]"
                >
                  Select
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-[10px] text-[var(--color-text-secondary)] text-left leading-relaxed border-t border-[var(--color-border)] pt-4">
            To continue, Google will share your name, email address, profile picture and language preference with CampusEstate.
          </div>
        </div>
      </Modal>
    </div>
  );
}
