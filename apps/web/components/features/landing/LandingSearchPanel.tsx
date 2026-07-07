'use client';

import type { PropertyType } from '@ems/shared';
import { motion } from 'framer-motion';

interface LandingSearchPanelProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedZone: string;
  setSelectedZone: (val: string) => void;
  activeTab: 'all' | PropertyType;
  setActiveTab: (val: 'all' | PropertyType) => void;
  selectedBedrooms: string;
  setSelectedBedrooms: (val: string) => void;
  priceRange: string;
  setPriceRange: (val: string) => void;
  zones: string[];
  totalCount: number;
  onReset: () => void;
}

export function LandingSearchPanel({
  searchTerm,
  setSearchTerm,
  selectedZone,
  setSelectedZone,
  activeTab,
  setActiveTab,
  selectedBedrooms,
  setSelectedBedrooms,
  priceRange,
  setPriceRange,
  zones,
  totalCount,
  onReset,
}: LandingSearchPanelProps) {
  const isAnyFilterActive =
    searchTerm || selectedZone !== 'all' || activeTab !== 'all' || selectedBedrooms !== 'all' || priceRange !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 70,
        damping: 15,
        delay: 0.45,
      }}
      className="mt-14 max-w-5xl mx-auto bg-[var(--color-surface-raised)]/80 backdrop-blur-xl p-5 rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] border border-[var(--color-border)]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Location Text Search */}
        <div className="relative">
          <label className="block text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5 px-1">
            Location Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by area or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-3 text-sm bg-[var(--color-surface-sunken)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors"
            />
            <svg className="absolute left-3 top-3.5 w-4 h-4 text-[var(--color-text-disabled)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </div>

        {/* Campus Zone Select */}
        <div>
          <label className="block text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5 px-1">
            Campus Zone
          </label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="w-full px-3.5 py-3 text-sm bg-[var(--color-surface-sunken)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors cursor-pointer"
          >
            <option value="all">📍 All Zones</option>
            {zones.map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>

        {/* Bedrooms Setup Select */}
        <div>
          <label className="block text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5 px-1">
            Room Setup
          </label>
          <select
            value={selectedBedrooms}
            onChange={(e) => setSelectedBedrooms(e.target.value)}
            className="w-full px-3.5 py-3 text-sm bg-[var(--color-surface-sunken)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors cursor-pointer"
          >
            <option value="all">🛏️ Any Configuration</option>
            <option value="0">Single Studio</option>
            <option value="1">1 Bedroom Flat</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4+">4+ Beds (Shared)</option>
          </select>
        </div>

        {/* Price Bracket Select */}
        <div>
          <label className="block text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5 px-1">
            Price Bracket
          </label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full px-3.5 py-3 text-sm bg-[var(--color-surface-sunken)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors cursor-pointer"
          >
            <option value="all">💸 All Price Levels</option>
            <option value="under-150">Under ₦150,000 / mo</option>
            <option value="150-300">₦150k - ₦300k / mo</option>
            <option value="above-300">Above ₦300,000 / mo</option>
          </select>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-secondary)] px-1">
        <span className="font-semibold">Found {totalCount} spaces matching criteria</span>
        {isAnyFilterActive && (
          <button
            onClick={onReset}
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-bold transition-colors hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>
    </motion.div>
  );
}
