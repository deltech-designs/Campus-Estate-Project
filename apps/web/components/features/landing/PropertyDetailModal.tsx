'use client';

import { Badge } from '@/components/partials/Badge';
import { Button } from '@/components/partials/Button';
import type { IEnhancedProperty } from './types';

interface PropertyDetailModalProps {
  property: IEnhancedProperty | null;
  onClose: () => void;
  isAuthenticated: boolean;
  onApply: () => void;
  showApplySuccess: boolean;
  leaseMonths: number;
  setLeaseMonths: (months: number) => void;
  includeUtilities: boolean;
  setIncludeUtilities: (val: boolean) => void;
  computedPricing: { base: number; service: number; total: number };
}

export function PropertyDetailModal({
  property,
  onClose,
  isAuthenticated,
  onApply,
  showApplySuccess,
  leaseMonths,
  setLeaseMonths,
  includeUtilities,
  setIncludeUtilities,
  computedPricing,
}: PropertyDetailModalProps) {
  if (!property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative bg-[var(--color-surface-raised)] rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] border border-[var(--color-border)] max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Visual Header Banner */}
        <div className="h-52 bg-gradient-to-tr from-[var(--color-sidebar-bg)] to-[var(--color-primary)] flex items-center justify-center text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors focus:outline-none z-20 cursor-pointer"
          >
            ✕
          </button>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <div className="text-center relative z-20 px-6 mt-6">
            <Badge variant="warning" className="mb-2 text-[10px] uppercase font-bold py-0.5 px-2 tracking-wide border-none">
              {property.type} Space
            </Badge>
            <h2 className="text-xl sm:text-2xl font-extrabold font-display leading-tight text-white">{property.title}</h2>
            <p className="mt-1 text-xs text-slate-300 font-medium">📍 {property.address}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto space-y-6">
          
          {/* Proximity and Host Details */}
          <div className="grid grid-cols-2 gap-4 bg-[var(--color-surface-sunken)] p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)]">
            <div>
              <span className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Walking Proximity</span>
              <span className="mt-1 block text-sm font-extrabold text-[var(--color-text-primary)] flex items-center gap-1">
                ⚡ {property.walkMinutes} Minutes walk ({property.distanceToCampus})
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Landlord / Owner</span>
              <span className="mt-1 block text-sm font-extrabold text-[var(--color-text-primary)] flex items-center gap-1.5">
                👤 {property.landlordName} 
                <span className="text-[10px] text-amber-500 font-bold">★ {property.landlordRating}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">About the Property</h4>
            <p className="mt-2 text-sm text-[var(--color-text-primary)] leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Verified Amenities</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map(am => (
                  <span key={am} className="px-3 py-1.5 bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-[var(--radius-md)] text-xs border border-[var(--color-border)] font-semibold shadow-sm flex items-center gap-1">
                    ✓ {am}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stylized CSS Proximity Map */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">Campus Proximity Route Map</h4>
            <div className="relative h-24 bg-slate-900 rounded-[var(--radius-lg)] border border-slate-800 overflow-hidden p-4 flex items-center justify-between">
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
              <div className="absolute top-1/2 left-[15%] right-[15%] h-1 bg-dashed border-t border-white/20 -translate-y-1/2 z-0" />
              
              {/* Property location */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] border border-white/20 flex items-center justify-center shadow-lg text-white">
                  🏠
                </div>
                <span className="text-[10px] font-bold text-slate-300">Space</span>
              </div>

              {/* Verified badge middle */}
              <div className="relative z-10 flex flex-col items-center bg-black/40 backdrop-blur border border-white/10 px-3 py-1 rounded-xl">
                <span className="text-[10px] font-black text-[var(--color-success)]">{property.walkMinutes} min walk</span>
                <span className="text-[9px] font-bold text-slate-400">Route verified</span>
              </div>

              {/* Campus location */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-success)] border border-white/20 flex items-center justify-center shadow-lg text-white">
                  🏫
                </div>
                <span className="text-[10px] font-bold text-slate-300">{property.estateZone}</span>
              </div>
            </div>
          </div>

          {/* Lease Planner */}
          {property.status === 'available' && (
            <div className="border-t border-[var(--color-border)] pt-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Custom Rental Planner</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] uppercase mb-1.5">Lease Term</label>
                  <select
                    value={leaseMonths}
                    onChange={(e) => setLeaseMonths(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2.5 text-xs bg-[var(--color-surface-sunken)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] focus:outline-none"
                  >
                    <option value={12}>12 Months (Full Academic Year)</option>
                    <option value={6}>6 Months (One Semester)</option>
                    <option value={24}>24 Months (Two Academic Years)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between bg-[var(--color-surface-sunken)] border border-[var(--color-border)] p-3 rounded-[var(--radius-md)]">
                  <div>
                    <span className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Service & Utilities</span>
                    <span className="text-[9px] text-[var(--color-text-secondary)]">Power, water, waste bills</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeUtilities}
                    onChange={(e) => setIncludeUtilities(e.target.checked)}
                    className="w-4 h-4 text-[var(--color-primary)] bg-[var(--color-surface-sunken)] border-[var(--color-border)] rounded focus:ring-[var(--color-primary)] cursor-pointer"
                  />
                </div>
              </div>

              {/* Total Calculation Output */}
              <div className="bg-[var(--color-surface-sunken)] p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[var(--color-text-secondary)]">Total Estimated Rental Cost</span>
                  <span className="block text-[10px] text-[var(--color-text-secondary)]">
                    Base: ₦{computedPricing.base.toLocaleString()} {includeUtilities && `+ Service: ₦${computedPricing.service.toLocaleString()}`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-[var(--color-primary)]">
                    ₦{computedPricing.total.toLocaleString()}
                  </span>
                  <span className="block text-[9px] font-bold text-[var(--color-text-secondary)]">For {leaseMonths} months</span>
                </div>
              </div>
            </div>
          )}

          {/* Alert check-ins */}
          {showApplySuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold text-center animate-pulse">
              ✓ Rent Application submitted successfully! Connecting to your Dashboard tenancy files...
            </div>
          )}
        </div>

        {/* Action CTAs */}
        <div className="bg-[var(--color-surface-sunken)] px-8 py-5 flex justify-end gap-3 border-t border-[var(--color-border)]">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Close Profile
          </Button>
          {property.status === 'available' && !showApplySuccess && (
            <Button size="sm" onClick={onApply} className="shadow">
              {isAuthenticated ? 'Sign Lease & Apply' : 'Sign In to Apply'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
