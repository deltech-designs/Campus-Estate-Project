'use client';

import { PropertyCard } from './PropertyCard';
import { Button } from '@/components/partials/Button';
import type { IEnhancedProperty } from './types';
import type { PropertyType } from '@ems/shared';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[var(--color-surface-sunken)] border border-[var(--color-border)] rounded-2xl relative">
          {([
            { id: 'all', label: 'All Spaces' },
            { id: 'apartment', label: 'Apartments' },
            { id: 'duplex', label: 'Shared Duplex' },
            { id: 'commercial', label: 'Studios / Hubs' },
            { id: 'land', label: 'Plots' }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer z-10 ${
                activeTab === tab.id
                  ? 'text-[var(--color-primary)] font-extrabold'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.span
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-[var(--color-surface-raised)] rounded-xl shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
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
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {properties.map(p => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <PropertyCard
                  property={p}
                  isWishlisted={wishlist.includes(p._id)}
                  onToggleWishlist={onToggleWishlist}
                  onViewDetails={onViewDetails}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

    </section>
  );
}
