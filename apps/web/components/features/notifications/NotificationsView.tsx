'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/partials/Button';
import { Bell, CreditCard, Wrench, ShieldAlert, FileText, Check } from 'lucide-react';
import { Badge } from '@/components/partials/Badge';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: 'payment' | 'lease' | 'maintenance' | 'system';
  timestamp: string;
  read: boolean;
  roles?: ('admin' | 'manager' | 'tenant')[];
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Rent payment received',
    description: 'Your rent payment of ₦350,000 for Apartment 4B has been successfully processed.',
    category: 'payment',
    timestamp: '2 hours ago',
    read: false,
    roles: ['tenant'],
  },
  {
    id: 'n2',
    title: 'New Maintenance Complaint',
    description: 'Tenant in Unit 2A filed a high priority complaint: "Kitchen sink pipes leaking".',
    category: 'maintenance',
    timestamp: '3 hours ago',
    read: false,
    roles: ['manager', 'admin'],
  },
  {
    id: 'n3',
    title: 'Lease Agreement Signed',
    description: 'John Doe has signed the lease agreement for Duplex C-12.',
    category: 'lease',
    timestamp: '1 day ago',
    read: true,
    roles: ['manager', 'admin'],
  },
  {
    id: 'n4',
    title: 'Rent Due Reminder',
    description: 'Your monthly lease payment of ₦200,000 is due in 5 days (July 10, 2026).',
    category: 'payment',
    timestamp: '1 day ago',
    read: false,
    roles: ['tenant'],
  },
  {
    id: 'n5',
    title: 'Maintenance worker assigned',
    description: 'Electrician Mr. Samuel Okoro has been assigned to your socket replacement request.',
    category: 'maintenance',
    timestamp: '2 days ago',
    read: true,
    roles: ['tenant'],
  },
  {
    id: 'n6',
    title: 'System Security Update',
    description: 'The server database has completed its automated weekly backup successfully.',
    category: 'system',
    timestamp: '3 days ago',
    read: true,
    roles: ['admin'],
  },
  {
    id: 'n7',
    title: 'Lease expiring soon',
    description: 'Your lease on Apartment 4B will expire in 30 days. Please apply for renewal if needed.',
    category: 'lease',
    timestamp: '4 days ago',
    read: false,
    roles: ['tenant'],
  },
];

export function NotificationsView() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'payment' | 'lease' | 'maintenance' | 'system'>('all');

  useEffect(() => {
    if (!user) return;
    // Filter by role
    const filtered = initialNotifications.filter(
      (n) => !n.roles || n.roles.includes(user.role as 'admin' | 'manager' | 'tenant')
    );
    setNotifications(filtered);
  }, [user]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filteredItems = notifications.filter(
    (n) => activeTab === 'all' || n.category === activeTab
  );

  const getIcon = (category: string) => {
    switch (category) {
      case 'payment':
        return <CreditCard className="text-emerald-500" size={18} />;
      case 'lease':
        return <FileText className="text-blue-500" size={18} />;
      case 'maintenance':
        return <Wrench className="text-amber-500" size={18} />;
      default:
        return <ShieldAlert className="text-violet-500" size={18} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payment':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'lease':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'maintenance':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-violet-50 text-violet-700 border-violet-100';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface-raised)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] hover:shadow-md hover:border-[var(--color-primary)]/10 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--color-primary-light)] rounded-lg text-[var(--color-primary)]">
            <Bell size={24} className="animate-[pulse_2s_infinite]" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-[var(--font-display)] text-[var(--color-foreground)]">Notification Center</h2>
            <p className="text-sm text-[var(--color-muted)]">
              You have {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={handleMarkAllAsRead}>
              <Check size={14} className="mr-1" /> Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" className="text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)]" onClick={handleClearAll}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-[var(--color-border)]">
        {(['all', 'payment', 'lease', 'maintenance', 'system'] as const).map((tab) => {
          const count = notifications.filter(
            (n) => (tab === 'all' || n.category === tab) && !n.read
          ).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'px-4 py-2 text-sm font-semibold capitalize rounded-lg transition-all',
                activeTab === tab
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] border border-transparent hover:border-[var(--color-border)]',
              ].join(' ')}
            >
              {tab === 'all' ? 'All Alerts' : tab}
              {count > 0 && (
                <span
                  className={[
                    'ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full border',
                    activeTab === tab ? 'bg-white text-[var(--color-primary)] border-white' : 'bg-[var(--color-danger)] text-white border-transparent',
                  ].join(' ')}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredItems.map((n) => (
          <div
            key={n.id}
            className={[
              'p-5 rounded-[var(--radius-lg)] border transition-all duration-200 flex gap-4 bg-[var(--color-surface-raised)] hover:shadow-md hover:border-[var(--color-primary)]/10',
              n.read
                ? 'border-[var(--color-border)] opacity-85'
                : 'border-[var(--color-primary)]/20 shadow-sm border-l-4 border-l-[var(--color-primary)]',
            ].join(' ')}
          >
            <div className={`p-2.5 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center border ${getCategoryColor(n.category)}`}>
              {getIcon(n.category)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-bold text-sm text-[var(--color-foreground)] leading-tight">{n.title}</h4>
                <Badge variant={n.category === 'payment' ? 'success' : n.category === 'maintenance' ? 'warning' : 'info'}>
                  {n.category}
                </Badge>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-[var(--color-danger)] inline-block shrink-0" />
                )}
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-2 leading-relaxed">{n.description}</p>
              <span className="text-xs text-[var(--color-muted)] font-medium">{n.timestamp}</span>
            </div>
            <div className="flex flex-col justify-between items-end gap-2">
              {!n.read && (
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  title="Mark as read"
                  className="p-1 rounded hover:bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <Check size={16} />
                </button>
              )}
              <button
                onClick={() => handleDelete(n.id)}
                className="text-xs text-[var(--color-text-disabled)] hover:text-[var(--color-danger)] transition-colors p-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-12 text-center shadow-sm">
            <span className="text-4xl mb-3 block">🎉</span>
            <h4 className="font-bold text-sm text-[var(--color-foreground)] mb-1">All Caught Up!</h4>
            <p className="text-xs text-[var(--color-muted)]">
              No pending notifications in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
