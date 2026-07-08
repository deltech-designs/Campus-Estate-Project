'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/partials/Avatar';
import { fullName } from '@/lib/utils';
import { Menu } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  '/overview':      'Overview',
  '/properties':    'Properties',
  '/tenants':       'Tenants',
  '/leases':        'Leases',
  '/maintenance':   'Maintenance',
  '/payments':      'Payments',
  '/chat':          'Chat',
  '/notifications': 'Notifications',
  '/vendors':       'Vendors',
  '/staff':         'Staff',
  '/reports':       'Reports',
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  let title = 'Dashboard';
  if (user?.role === 'tenant') {
    if (pathname === '/tenants') {
      title = 'Overview';
    } else if (pathname.startsWith('/tenants/properties')) {
      title = 'Properties';
    } else if (pathname.startsWith('/tenants/my-lease')) {
      title = 'My Lease';
    } else if (pathname.startsWith('/tenants/payments')) {
      title = 'Payments';
    } else if (pathname.startsWith('/tenants/maintenance')) {
      title = 'Maintenance';
    } else if (pathname.startsWith('/tenants/profile')) {
      title = 'Profile';
    } else if (pathname.startsWith('/tenants/notifications')) {
      title = 'Notifications';
    } else if (pathname.startsWith('/tenants/overview')) {
      title = 'Overview';
    }
  } else {
    title = Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ?? 'Dashboard';
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[var(--color-surface-raised)] border-b border-[var(--color-border)] shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        {/* Hamburger (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-surface-sunken)] text-[var(--color-text-primary)] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
          {title}
        </h1>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <Avatar name={fullName(user.firstName, user.lastName)} size="sm" />
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-[var(--color-foreground)] leading-tight font-[var(--font-display)]">
              {fullName(user.firstName, user.lastName)}
            </p>
            <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider font-bold capitalize">{user.role}</p>
          </div>
        </div>
      )}
    </header>
  );
}
