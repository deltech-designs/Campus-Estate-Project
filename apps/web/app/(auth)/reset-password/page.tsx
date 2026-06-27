import { Suspense } from 'react';
import { ResetPasswordView } from '@/components/features/auth/ResetPasswordView';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
        <p className="text-xs text-[var(--color-text-secondary)] animate-pulse">Loading password reset form...</p>
      </div>
    }>
      <ResetPasswordView />
    </Suspense>
  );
}
