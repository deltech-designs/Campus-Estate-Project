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

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

export function LoginView() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      setError(null);
      await login(values.email, values.password);
      router.push('/overview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-sidebar)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[var(--color-primary)] items-center justify-center text-white text-2xl font-bold mb-4">E</div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-display)]">Welcome back</h1>
          <p className="text-[var(--color-sidebar-text)] text-sm mt-1">Sign in to Estate Management System</p>
        </div>
        <div className="bg-white rounded-[var(--radius-card)] p-8 shadow-[var(--shadow-modal)]">
          {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input label="Email" type="email" placeholder="admin@estate.com" error={errors.email?.message} {...register('email')} />
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            <Button type="submit" loading={isSubmitting} className="mt-2 w-full">Sign in</Button>
          </form>
          <p className="text-center text-sm text-[var(--color-muted)] mt-4">
            Don't have an account?{' '}
            <Link href="/register" className="text-[var(--color-primary)] font-medium hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
