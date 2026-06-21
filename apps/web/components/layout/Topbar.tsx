'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/partials/Avatar';
import { fullName } from '@/lib/utils';

interface TopbarProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  '/overview':    'Overview',
  '/properties':  'Properties',
  '/tenants':     'Tenants',
  '/leases':      'Leases',
  '/maintenance': 'Maintenance',
  '/payments':    'Payments',
  '/vendors':     'Vendors',
  '/staff':       'Staff',
  '/reports':     'Reports',
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const title = Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ?? 'Dashboard';

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-[var(--color-border)] shrink-0">
      <div className="flex items-center gap-4">
        {/* Hamburger (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
          aria-label="Open menu"
        >
          <span className="block w-5 h-0.5 bg-[var(--color-foreground)] mb-1" />
          <span className="block w-5 h-0.5 bg-[var(--color-foreground)] mb-1" />
          <span className="block w-5 h-0.5 bg-[var(--color-foreground)]" />
        </button>

        <h1 className="text-lg font-semibold font-[var(--font-display)] text-[var(--color-foreground)]">
          {title}
        </h1>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <Avatar name={fullName(user.firstName, user.lastName)} size="sm" />
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-[var(--color-foreground)] leading-tight">
              {fullName(user.firstName, user.lastName)}
            </p>
            <p className="text-xs text-[var(--color-muted)] capitalize">{user.role}</p>
          </div>
        </div>
      )}
    </header>
  );
}
