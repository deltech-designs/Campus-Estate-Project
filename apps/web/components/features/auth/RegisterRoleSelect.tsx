'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function RegisterRoleSelect() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--color-sidebar-bg)] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        {/* Top Header & Branding */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-[var(--color-primary)] items-center justify-center text-white text-3xl font-extrabold shadow-lg mb-4 select-none">
            E
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-[var(--font-display)] tracking-tight">
            Create your account
          </h1>
          <p className="text-[var(--color-sidebar-text)] text-sm sm:text-base mt-2 max-w-md mx-auto">
            Choose your role to get started with the Campus Estate Management System.
          </p>
        </div>

        {/* Roles Selection Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Tenant Selector */}
          <div
            onClick={() => router.push('/register/tenant')}
            className="group relative cursor-pointer overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 shadow-[var(--shadow-card)] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-emerald-500/30 flex flex-col justify-between"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-300" />
            
            <div>
              {/* Icon Container */}
              <div className="inline-flex w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>

              {/* Title & Copy */}
              <h2 className="text-xl font-bold text-white font-[var(--font-display)] mb-2 group-hover:text-emerald-400 transition-colors">
                I am a Tenant
              </h2>
              <p className="text-sm text-[var(--color-sidebar-text)] leading-relaxed mb-6">
                Students, staff, or faculty members looking for quality campus accommodation. Find hostels, pay rent, view leases, and report maintenance faults.
              </p>
            </div>

            {/* CTA indicator */}
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <span>Sign up as Tenant</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 group-hover:translate-x-1.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Landlord/Manager Selector */}
          <div
            onClick={() => router.push('/register/landlord')}
            className="group relative cursor-pointer overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 shadow-[var(--shadow-card)] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-[var(--color-primary)]/30 flex flex-col justify-between"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-[var(--color-primary)]/10 blur-3xl group-hover:bg-[var(--color-primary)]/20 transition-all duration-300" />
            
            <div>
              {/* Icon Container */}
              <div className="inline-flex w-14 h-14 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>

              {/* Title & Copy */}
              <h2 className="text-xl font-bold text-white font-[var(--font-display)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                I am a Landlord / Owner
              </h2>
              <p className="text-sm text-[var(--color-sidebar-text)] leading-relaxed mb-6">
                Hostel managers, property agents, or building owners. List properties, manage tenant occupancies, track collections, and assign maintenance vendors.
              </p>
            </div>

            {/* CTA indicator */}
            <div className="flex items-center gap-2 text-[var(--color-primary)] font-semibold text-sm">
              <span>Sign up as Landlord</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 group-hover:translate-x-1.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Footer Link */}
        <div className="text-center mt-12">
          <p className="text-sm text-[var(--color-sidebar-text)]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-white hover:text-[var(--color-primary)] font-semibold underline underline-offset-4 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
