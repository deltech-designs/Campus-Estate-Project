'use client';

import { PropertyCard } from './PropertyCard';
import { Button } from '@/components/partials/Button';
import type { IEnhancedProperty } from './types';
import type { PropertyType } from '@ems/shared';

interface PropertyGridProps {
  properties: IEnhancedProperty[];
  wishlist: string[];
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
  onViewDetails: (property: IEnhancedProperty) => void;
  activeTab: 'all' | PropertyType;
  setActiveTab: (val: 'all' | PropertyType) => void;
  onReset: () => void;
}

export function PropertyGrid({
  properties,
  wishlist,
  onToggleWishlist,
  onViewDetails,
  activeTab,
  setActiveTab,
  onReset,
}: PropertyGridProps) {
  return (
    <section id="properties" className="py-12 max-w-7xl mx-auto px-6 w-full">
      
      {/* Grid section headers and active category tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
        <div className="text-left">
          <h2 className="text-3xl font-extrabold font-display text-[var(--color-text-primary)] tracking-tight">
            Featured Campus Listings
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] max-w-xl">
            Hand-picked verified properties located in secure student residential corridors.
          </p>
        </div>

        {/* Category selection bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[var(--color-surface-sunken)] border border-[var(--color-border)] rounded-2xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[var(--color-surface-raised)] text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            All Spaces
          </button>
          <button
            onClick={() => setActiveTab('apartment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'apartment'
                ? 'bg-[var(--color-surface-raised)] text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Apartments
          </button>
          <button
            onClick={() => setActiveTab('duplex')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'duplex'
                ? 'bg-[var(--color-surface-raised)] text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Shared Duplex
          </button>
          <button
            onClick={() => setActiveTab('commercial')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'commercial'
                ? 'bg-[var(--color-surface-raised)] text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Studios / Hubs
          </button>
          <button
            onClick={() => setActiveTab('land')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'land'
                ? 'bg-[var(--color-surface-raised)] text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Plots
          </button>
        </div>
      </div>

      {/* Grid of properties or empty state */}
      {properties.length === 0 ? (
        <div className="text-center py-20 bg-[var(--color-surface-raised)] rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] shadow-sm max-w-lg mx-auto">
          <span className="text-5xl">🔍</span>
          <h3 className="mt-5 text-lg font-bold text-[var(--color-text-primary)] font-display">No matching spaces found</h3>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] px-6">
            There are currently no listings match your query. Try broadening your location tags or clearing filters.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-6"
            onClick={onReset}
          >
            Show All Listings
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(p => (
            <PropertyCard
              key={p._id}
              property={p}
              isWishlisted={wishlist.includes(p._id)}
              onToggleWishlist={onToggleWishlist}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

    </section>
  );
}
