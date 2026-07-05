'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/partials/Avatar';
import { fullName } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { href: '/overview',      label: 'Overview',      icon: '◉' },
  { href: '/properties',    label: 'Properties',    icon: '🏠' },
  { href: '/tenants',       label: 'Tenants',       icon: '👥', roles: ['admin', 'manager'] },
  { href: '/leases',        label: 'Leases',        icon: '📄' },
  { href: '/maintenance',   label: 'Maintenance',   icon: '🔧' },
  { href: '/payments',      label: 'Payments',      icon: '💳' },
  { href: '/chat',          label: 'Chat',          icon: '💬' },
  { href: '/notifications', label: 'Notifications', icon: '🔔' },
  { href: '/vendors',       label: 'Vendors',       icon: '🏭', roles: ['admin', 'manager'] },
  { href: '/staff',         label: 'Staff',         icon: '👔', roles: ['admin'] },
  { href: '/reports',       label: 'Reports',       icon: '📊', roles: ['admin', 'manager'] },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const visibleItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[var(--color-sidebar)]',
          'transition-transform duration-300 ease-[var(--ease-spring)]',
          'lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm">
            E
          </div>
          <span className="font-bold text-white font-[var(--font-display)] tracking-wide text-sm">
            EMS Platform
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={[
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150',
                  isActive
                    ? 'bg-[var(--color-sidebar-active)] text-white font-medium'
                    : 'text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)] hover:text-white',
                ].join(' ')}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        {user && (
          <div className="px-3 py-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-2 mb-3">
              <Avatar name={fullName(user.firstName, user.lastName)} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {fullName(user.firstName, user.lastName)}
                </p>
                <p className="text-xs text-[var(--color-sidebar-text)] capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => void logout()}
              className="w-full text-left px-3 py-2 text-sm text-[var(--color-sidebar-text)] hover:text-white hover:bg-[var(--color-sidebar-hover)] rounded-lg transition-colors duration-150"
            >
              Sign out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
