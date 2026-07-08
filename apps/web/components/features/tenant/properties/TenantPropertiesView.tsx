'use client';

import { useState } from 'react';
import { useProperties } from '@/components/features/properties/use-properties';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/partials/Badge';
import { Select } from '@/components/partials/Select';
import { Button } from '@/components/partials/Button';
import { Modal } from '@/components/partials/Modal';
import { formatCurrency, capitalise } from '@/lib/utils';
import type { IProperty, PropertyType, PropertyStatus, IPopulatedLandlord } from '@ems/shared';
import {
  MapPin,
  Home,
  Bed,
  Search,
  Phone,
  Mail,
  User,
  ExternalLink,
  Info,
} from 'lucide-react';

const statusVariant: Record<PropertyStatus, 'success' | 'warning' | 'danger' | 'neutral' | 'info'> = {
  available:   'success',
  occupied:    'info',
  maintenance: 'warning',
  inactive:    'neutral',
};

const propertyTypes = [
  { label: 'All Types', value: '' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Duplex', value: 'duplex' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Land', value: 'land' },
];

const propertyStatuses = [
  { label: 'All Statuses', value: '' },
  { label: 'Available', value: 'available' },
  { label: 'Occupied', value: 'occupied' },
  { label: 'Maintenance', value: 'maintenance' },
];

const sortOptions = [
  { label: 'Newest Added', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

export function TenantPropertiesView() {
  const { properties, isLoading, error, refetch } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display)] text-[var(--color-foreground)] mb-1">Estate Properties</h2>
          <p className="text-sm text-[var(--color-muted)]">Browse hostel units, apartments, and commercial spaces on campus</p>
        </div>
        <CardSkeleton count={4} />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => void refetch()} />;
  }

  // Filter & Search Logic
  const filteredProperties = properties
    .filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.estateZone.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = !selectedType || p.type === selectedType;
      const matchStatus = !selectedStatus || p.status === selectedStatus;
      return matchSearch && matchType && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.rentAmount - b.rentAmount;
      if (sortBy === 'price-desc') return b.rentAmount - a.rentAmount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display)] text-[var(--color-foreground)] mb-1">Estate Properties</h2>
          <p className="text-sm text-[var(--color-muted)]">Browse hostel units, apartments, and commercial spaces on campus</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-card)] space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--color-text-secondary)]">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search by title, address, or estate zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-[var(--color-foreground)] placeholder-[var(--color-text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-150"
            />
          </div>

          {/* Select Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:w-2/5">
            <Select
              options={propertyTypes}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[var(--color-surface-sunken)] border-[var(--color-border)] focus:ring-[var(--color-primary)]/25 py-2 rounded-[var(--radius-md)]"
            />
            <Select
              options={propertyStatuses}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[var(--color-surface-sunken)] border-[var(--color-border)] focus:ring-[var(--color-primary)]/25 py-2 rounded-[var(--radius-md)]"
            />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[var(--color-surface-sunken)] border-[var(--color-border)] focus:ring-[var(--color-primary)]/25 py-2 rounded-[var(--radius-md)]"
            />
          </div>
        </div>
      </div>

      {/* Grid List */}
      {filteredProperties.length === 0 ? (
        <EmptyState
          title="No properties found"
          description="Try broadening your search or adjusting the filters to see more results."
          icon="🏠"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((p) => (
            <div
              key={p._id}
              className="flex flex-col bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] overflow-hidden hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all duration-300 group"
            >
              {/* Header Image Mock */}
              <div className="h-44 bg-gradient-to-r from-slate-100 to-indigo-50 dark:from-slate-800 dark:to-indigo-950 flex items-center justify-center relative border-b border-[var(--color-border)]">
                <div className="absolute top-3 right-3 z-10">
                  <Badge variant={statusVariant[p.status]}>{capitalise(p.status)}</Badge>
                </div>
                <div className="absolute top-3 left-3 bg-white/80 dark:bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider text-[var(--color-primary)] uppercase">
                  {capitalise(p.type)}
                </div>
                <Home size={48} className="text-[var(--color-primary)]/40 group-hover:scale-105 transition-transform duration-300" />
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-[var(--color-foreground)] font-[var(--font-display)] text-base leading-tight group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                    <MapPin size={12} className="shrink-0" />
                    <span className="line-clamp-1">{p.address} • Zone: {p.estateZone}</span>
                  </p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 py-3 border-y border-[var(--color-border)] text-xs">
                  <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                    <Bed size={14} className="text-[var(--color-primary)]" />
                    <span>{p.bedrooms} Bedrooms</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-[var(--color-muted)] text-[10px] block leading-none">RENT / MONTH</span>
                    <span className="font-bold text-sm text-[var(--color-primary)]">{formatCurrency(p.rentAmount)}</span>
                  </div>
                </div>

                {/* Amenities preview */}
                <div className="flex flex-wrap gap-1">
                  {(p.amenities || ['Water', 'Power', 'Security']).slice(0, 3).map((am, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] rounded-full font-medium"
                    >
                      {am}
                    </span>
                  ))}
                  {p.amenities && p.amenities.length > 3 && (
                    <span className="text-[9px] font-bold text-[var(--color-muted)] px-1.5 self-center">
                      +{p.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* Action button */}
                <Button
                  onClick={() => setSelectedProperty(p)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 mt-2 text-xs font-semibold"
                >
                  <Info size={14} />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        title="Property Specifications"
        size="md"
      >
        {selectedProperty && (
          <div className="space-y-6">
            {/* Top banner */}
            <div className="p-4 bg-gradient-to-br from-indigo-50/50 to-emerald-50/30 dark:from-indigo-950/20 dark:to-emerald-950/10 rounded-xl border border-[var(--color-border)] flex items-start gap-4">
              <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-xl flex items-center justify-center text-[var(--color-primary)] shrink-0">
                <Home size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[var(--color-foreground)] font-[var(--font-display)] leading-tight">
                  {selectedProperty.title}
                </h3>
                <p className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                  <MapPin size={12} /> {selectedProperty.address}
                </p>
              </div>
            </div>

            {/* Core Specs Grid */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-[var(--color-surface-sunken)] rounded-xl text-center">
              <div>
                <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider font-semibold">Type</p>
                <p className="text-sm font-bold text-[var(--color-foreground)] mt-0.5 capitalize">{selectedProperty.type}</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider font-semibold">Bedrooms</p>
                <p className="text-sm font-bold text-[var(--color-foreground)] mt-0.5">{selectedProperty.bedrooms} Beds</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider font-semibold">Monthly Rent</p>
                <p className="text-sm font-extrabold text-[var(--color-primary)] mt-0.5">
                  {formatCurrency(selectedProperty.rentAmount)}
                </p>
              </div>
            </div>

            {/* Status & Zone Info */}
            <div className="space-y-2 text-sm border-t border-[var(--color-border)] pt-4">
              <div className="flex justify-between items-center py-1">
                <span className="text-[var(--color-text-secondary)]">Availability Status</span>
                <Badge variant={statusVariant[selectedProperty.status]}>
                  {capitalise(selectedProperty.status)}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-[var(--color-border)]/50">
                <span className="text-[var(--color-text-secondary)]">Estate Zone</span>
                <span className="font-semibold text-[var(--color-foreground)]">{selectedProperty.estateZone}</span>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="space-y-2 border-t border-[var(--color-border)] pt-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">Amenities Provided</h4>
              <div className="flex flex-wrap gap-2">
                {(selectedProperty.amenities || ['Water Supply', 'Power Backup', '24/7 Security']).map((am, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] font-medium rounded-full border border-[var(--color-border)]/40"
                  >
                    ✓ {am}
                  </span>
                ))}
              </div>
            </div>

            {/* Landlord / Manager Details */}
            <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">Managing Landlord / Agent</h4>
              {selectedProperty.landlordId && typeof selectedProperty.landlordId === 'object' ? (
                (() => {
                  const landlord = selectedProperty.landlordId as IPopulatedLandlord;
                  return (
                    <div className="p-4 rounded-xl border border-[var(--color-border)] bg-indigo-50/10 dark:bg-indigo-950/5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-[var(--color-muted)]">Full Name</p>
                          <p className="text-sm font-semibold text-[var(--color-foreground)]">
                            {landlord.firstName} {landlord.lastName}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--color-border)]/40 text-xs">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-[var(--color-muted)] shrink-0" />
                          <a href={`mailto:${landlord.email}`} className="text-[var(--color-primary)] hover:underline font-medium truncate">
                            {landlord.email}
                          </a>
                        </div>
                        {landlord.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-[var(--color-muted)] shrink-0" />
                            <a href={`tel:${landlord.phone}`} className="text-[var(--color-primary)] hover:underline font-medium">
                              {landlord.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-[var(--color-border)] text-center text-xs text-[var(--color-muted)]">
                  No landlord details specified. Please contact administration.
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
              <Button variant="secondary" onClick={() => setSelectedProperty(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setSelectedProperty(null);
                  window.location.href = '/chat';
                }}
                className="flex items-center gap-1.5"
              >
                Open Inbox Chat
                <ExternalLink size={12} />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
