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

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  email:     z.string().email('Invalid email'),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
});
type FormValues = z.infer<typeof schema>;

interface RegisterViewProps {
  role?: 'tenant' | 'manager';
}

export function RegisterView({ role = 'tenant' }: RegisterViewProps) {
  const { register: authRegister } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setError(null);
      await authRegister(values.firstName, values.lastName, values.email, values.password, role);
      router.push('/overview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  // Google Mock Accounts configuration based on selected role
  const googleAccounts = role === 'tenant'
    ? [
        { name: 'John Student', email: 'john.student@gmail.com', avatar: 'JS' },
        { name: 'Dr. Sarah Lecturer', email: 's.lecturer@gmail.com', avatar: 'SL' },
      ]
    : [
        { name: 'Alhaji Rasaq', email: 'rasaq.hostels@gmail.com', avatar: 'AR' },
        { name: 'Benson Owner', email: 'benson.estates@gmail.com', avatar: 'BO' },
      ];

  const handleGoogleSelect = async (account: { name: string; email: string }) => {
    setIsGoogleModalOpen(false);
    setGoogleLoading(true);
    setError(null);

    // split name to firstName and lastName
    const [firstName = 'Google', lastName = 'User'] = account.name.split(' ');

    try {
      // Simulate OAuth network latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Register via AuthContext
      await authRegister(firstName, lastName, account.email, 'GoogleOAuthPassword123!', role);
      router.push('/overview');
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

  const isTenant = role === 'tenant';

  return (
    <div className="min-h-screen bg-[var(--color-sidebar-bg)] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        
        {/* Dynamic Navigation/Back Link */}
        <div className="mb-6">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-sidebar-text)] hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to role selection
          </Link>
        </div>

        {/* Branding & Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex w-14 h-14 rounded-2xl items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg transition-all duration-300 ${
            isTenant ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-[var(--color-primary)] shadow-[var(--color-primary)]/20'
          }`}>
            E
          </div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-display)]">
            {isTenant ? 'Join as a Tenant' : 'Join as a Landlord'}
          </h1>
          <p className="text-[var(--color-sidebar-text)] text-xs mt-1.5 max-w-xs mx-auto">
            {isTenant
              ? 'Find verified student hostels and lease properties online.'
              : 'List hostel buildings, manage tenants, and automate collections.'}
          </p>
        </div>

        {/* Signup Form Container */}
        <div className="bg-white rounded-[var(--radius-card)] p-6 sm:p-8 shadow-[var(--shadow-modal)] border border-[var(--color-border)]">
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Google Sign Up Button */}
          <Button
            type="button"
            variant="secondary"
            loading={googleLoading}
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-sunken)] text-[var(--color-text-primary)] font-semibold rounded-[var(--radius-btn)] transition-all duration-150 active:scale-[0.99]"
          >
            {/* Google Vector Icon */}
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

          {/* Custom Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-[var(--color-border)]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[var(--color-text-secondary)] font-semibold tracking-wide">
                Or register with email
              </span>
            </div>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4.5" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                placeholder="John"
                error={errors.firstName?.message}
                {...register('firstName')}
                className="focus:ring-emerald-500/20"
              />
              <Input
                label="Last name"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="john@estate.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            
            <Button
              type="submit"
              loading={isSubmitting}
              className={`mt-2 w-full py-2.5 text-sm font-semibold rounded-[var(--radius-btn)] transition-all duration-150 ${
                isTenant
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/10'
                  : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-lg shadow-primary/10'
              }`}
            >
              Get Started
            </Button>
          </form>

          {/* Bottom Navigation */}
          <p className="text-center text-xs text-[var(--color-text-secondary)] mt-5">
            Already have an account?{' '}
            <Link
              href="/login"
              className={`font-semibold hover:underline ${
                isTenant ? 'text-emerald-600' : 'text-[var(--color-primary)]'
              }`}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Google Mock Account Chooser Modal */}
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

          {/* Account Chooser List */}
          {!showCustomInput ? (
            <div className="flex flex-col divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-surface)]">
              {googleAccounts.map((acc, index) => (
                <button
                  key={index}
                  onClick={() => handleGoogleSelect(acc)}
                  className="flex items-center gap-3 p-3.5 text-left w-full hover:bg-[var(--color-surface-sunken)] transition-colors duration-150 group"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:scale-105 duration-150 ${
                    isTenant ? 'bg-emerald-500' : 'bg-[var(--color-primary)]'
                  }`}>
                    {acc.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--color-text-primary)] truncate">{acc.name}</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)] truncate">{acc.email}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-[var(--color-text-secondary)] font-medium">Logged in</span>
                  </div>
                </button>
              ))}

              <button
                onClick={() => setShowCustomInput(true)}
                className="flex items-center gap-3 p-3.5 text-left w-full hover:bg-[var(--color-surface-sunken)] transition-colors duration-150 group text-xs font-medium text-[var(--color-text-secondary)]"
              >
                <div className="w-8 h-8 rounded-full border border-dashed border-[var(--color-border)] flex items-center justify-center text-lg text-[var(--color-text-secondary)]">
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
                  className={isTenant ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-[var(--color-primary)]'}
                >
                  Select
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-[10px] text-[var(--color-text-secondary)] text-left leading-relaxed">
            To continue, Google will share your name, email address, profile picture and language preference with CampusEstate.
          </div>
        </div>
      </Modal>
    </div>
  );
}
