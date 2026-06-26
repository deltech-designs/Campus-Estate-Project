'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Building2, ChevronRight, ArrowLeft } from 'lucide-react';

export function RegisterRoleSelect() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute -left-40 -top-40 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl animate-pulse-subtle" />
      <div className="absolute -right-40 -bottom-40 w-96 h-96 rounded-full bg-[var(--color-primary)]/5 blur-3xl animate-float-delayed" />
      <div className="absolute left-1/3 top-1/2 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Back Link to Landing */}
        <div className="mb-6 flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </Link>
        </div>

        {/* Top Header & Branding */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-[var(--color-primary)] items-center justify-center text-white text-3xl font-extrabold shadow-lg mb-4 select-none animate-float">
            E
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] font-[var(--font-display)] tracking-tight">
            Create your account
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm sm:text-base mt-2.5 max-w-md mx-auto">
            Select your role to register with the Campus Estate Management System.
          </p>
        </div>

        {/* Roles Selection Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Tenant Card */}
          <div
            onClick={() => router.push('/register/tenant')}
            className="group relative cursor-pointer overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-sunken)] p-8 shadow-[var(--shadow-card)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 flex flex-col justify-between"
          >
            {/* Top Indicator Line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 to-teal-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

            {/* Ambient Card Glow */}
            <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all duration-300" />
            
            <div>
              {/* Icon Container */}
              <div className="inline-flex w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Home size={26} />
              </div>

              {/* Title & Copy */}
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] font-[var(--font-display)] mb-3 group-hover:text-emerald-600 transition-colors">
                I am a Tenant / Student
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                Looking for quality campus accommodation? Find verified hostels, sign digital leases, track rent receipts, and submit quick maintenance requests.
              </p>
            </div>

            {/* CTA indicator */}
            <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm mt-4 border-t border-[var(--color-border)] pt-4">
              <span>Sign up as Tenant</span>
              <ChevronRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Landlord Card */}
          <div
            onClick={() => router.push('/register/landlord')}
            className="group relative cursor-pointer overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-sunken)] p-8 shadow-[var(--shadow-card)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/30 flex flex-col justify-between"
          >
            {/* Top Indicator Line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[var(--color-primary)] to-blue-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

            {/* Ambient Card Glow */}
            <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-[var(--color-primary)]/5 blur-3xl group-hover:bg-[var(--color-primary)]/10 transition-all duration-300" />
            
            <div>
              {/* Icon Container */}
              <div className="inline-flex w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Building2 size={26} />
              </div>

              {/* Title & Copy */}
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] font-[var(--font-display)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                I am a Landlord / Owner
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                Managing properties or hostel blocks? List rental spaces, automate rent billing, track portfolios, and assign maintenance contractors.
              </p>
            </div>

            {/* CTA indicator */}
            <div className="flex items-center gap-2 text-[var(--color-primary)] font-semibold text-sm mt-4 border-t border-[var(--color-border)] pt-4">
              <span>Sign up as Landlord</span>
              <ChevronRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Bottom Footer Link */}
        <div className="text-center mt-12">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-semibold underline underline-offset-4 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
