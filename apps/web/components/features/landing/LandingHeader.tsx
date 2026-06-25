'use client';

import { Button } from '@/components/partials/Button';

interface LandingHeaderProps {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

export function LandingHeader({ isAuthenticated, isAuthLoading }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-[var(--radius-md)] flex items-center justify-center shadow-md">
            <span className="text-[var(--color-text-inverse)] text-xl font-bold font-display">E</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[var(--color-primary)] font-display">
            CampusEstate
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-sm font-semibold text-[var(--color-text-secondary)]">
          <a href="#properties" className="hover:text-[var(--color-primary)] transition-all duration-200 relative group py-2">
            Browse Properties
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#features" className="hover:text-[var(--color-primary)] transition-all duration-200 relative group py-2">
            Platform Features
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#stats" className="hover:text-[var(--color-primary)] transition-all duration-200 relative group py-2">
            Live Stats
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#testimonials" className="hover:text-[var(--color-primary)] transition-all duration-200 relative group py-2">
            Reviews
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full" />
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthLoading ? (
            <span className="w-5 h-5 border-2 border-[var(--color-text-secondary)] border-t-transparent rounded-full animate-spin" />
          ) : isAuthenticated ? (
            <Button onClick={() => window.location.href = '/overview'} size="md" className="shadow-sm">
              Go to Dashboard
            </Button>
          ) : (
            <>
              <a href="/login" className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                Sign In
              </a>
              <Button onClick={() => window.location.href = '/register'} size="md" className="shadow-sm">
                Create Account
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
