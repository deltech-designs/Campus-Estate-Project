'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/partials/Avatar';
import { fullName } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Wrench,
  CreditCard,
  MessageSquare,
  Bell,
  HardHat,
  UserCog,
  BarChart3,
  LogOut,
  Home,
  UserCircle,
  Settings,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navItems: NavItem[] = [
  // ── Shared / Admin + Manager ──────────────────────────────────────────────
  { href: '/overview',      label: 'Overview',      icon: LayoutDashboard },
  { href: '/properties',    label: 'Properties',    icon: Building2,       roles: ['admin', 'manager'] },
  { href: '/tenants',       label: 'Tenants',       icon: Users,           roles: ['admin', 'manager'] },
  { href: '/leases',        label: 'Leases',        icon: FileText,        roles: ['admin', 'manager'] },
  { href: '/maintenance',   label: 'Maintenance',   icon: Wrench },
  { href: '/payments',      label: 'Payments',      icon: CreditCard },
  { href: '/chat',          label: 'Chat',          icon: MessageSquare,   roles: ['admin', 'manager'] },
  { href: '/notifications', label: 'Notifications', icon: Bell,            roles: ['admin', 'manager'] },
  { href: '/vendors',       label: 'Vendors',       icon: HardHat,         roles: ['admin', 'manager'] },
  { href: '/staff',         label: 'Staff',         icon: UserCog,         roles: ['admin'] },
  { href: '/reports',       label: 'Reports',       icon: BarChart3,       roles: ['admin', 'manager'] },
  { href: '/settings',      label: 'Settings',      icon: Settings,        roles: ['admin'] },
  // ── Tenant-only ───────────────────────────────────────────────────────────
  { href: '/my-lease',      label: 'My Lease',      icon: Home,            roles: ['tenant'] },
  { href: '/profile',       label: 'Profile',       icon: UserCircle,      roles: ['tenant'] },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const visibleItems = navItems
    .filter((item) => !item.roles || (user && item.roles.includes(user.role)))
    .map((item) => {
      if (user?.role === 'tenant') {
        if (item.href === '/overview') {
          return { ...item, href: '/tenants' };
        }
        if (item.href === '/my-lease') {
          return { ...item, href: '/tenants/my-lease' };
        }
        if (item.href === '/profile') {
          return { ...item, href: '/tenants/profile' };
        }
        if (item.href === '/payments') {
          return { ...item, href: '/tenants/payments' };
        }
        if (item.href === '/maintenance') {
          return { ...item, href: '/tenants/maintenance' };
        }
      }
      if (user?.role === 'manager') {
        if (item.href === '/overview') {
          return { ...item, href: '/manager/overview' };
        }
        if (item.href === '/properties') {
          return { ...item, href: '/manager/properties' };
        }
        if (item.href === '/leases') {
          return { ...item, href: '/manager/leases' };
        }
        if (item.href === '/maintenance') {
          return { ...item, href: '/manager/maintenance' };
        }
        if (item.href === '/payments') {
          return { ...item, href: '/manager/payments' };
        }
        if (item.href === '/notifications') {
          return { ...item, href: '/manager/notifications' };
        }
        if (item.href === '/profile') {
          return { ...item, href: '/manager/profile' };
        }
      }
      if (user?.role === 'admin') {
        if (item.href === '/overview') {
          return { ...item, href: '/admin/overview' };
        }
        if (item.href === '/properties') {
          return { ...item, href: '/admin/properties' };
        }
        if (item.href === '/tenants') {
          return { ...item, href: '/admin/tenants' };
        }
        if (item.href === '/leases') {
          return { ...item, href: '/admin/leases' };
        }
        if (item.href === '/maintenance') {
          return { ...item, href: '/admin/maintenance' };
        }
        if (item.href === '/payments') {
          return { ...item, href: '/admin/payments' };
        }
        if (item.href === '/notifications') {
          return { ...item, href: '/admin/notifications' };
        }
        if (item.href === '/vendors') {
          return { ...item, href: '/admin/vendors' };
        }
        if (item.href === '/staff') {
          return { ...item, href: '/admin/staff' };
        }
        if (item.href === '/reports') {
          return { ...item, href: '/admin/reports' };
        }
        if (item.href === '/settings') {
          return { ...item, href: '/admin/settings' };
        }
      }
      return item;
    });

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
          <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-[var(--radius-md)] flex items-center justify-center shadow-[0_0_15px_rgba(var(--color-primary),0.2)]">
            <span className="text-white text-lg font-bold font-[var(--font-display)]">E</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white font-[var(--font-display)]">
            CampusEstate
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/tenants' || item.href === '/overview' || item.href === '/manager/overview'
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                  isActive
                    ? 'bg-[var(--color-sidebar-hover)] text-white font-medium border-l-2 border-[var(--color-sidebar-accent)] pl-2.5'
                    : 'text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)] hover:text-white',
                ].join(' ')}
              >
                <Icon className="w-4 h-4" />
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
                <p className="text-sm font-medium text-white truncate font-[var(--font-display)]">
                  {fullName(user.firstName, user.lastName)}
                </p>
                <p className="text-[10px] text-[var(--color-sidebar-text)] uppercase font-bold tracking-wider capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => void logout()}
              className="w-full text-left px-3 py-2 text-sm text-[var(--color-sidebar-text)] hover:text-white hover:bg-[var(--color-sidebar-hover)] rounded-lg transition-colors duration-150 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
