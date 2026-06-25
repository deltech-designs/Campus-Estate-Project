'use client';

import { Badge } from '@/components/partials/Badge';
import { Button } from '@/components/partials/Button';
import type { IEnhancedProperty } from './types';
import type { PropertyType } from '@ems/shared';

interface PropertyCardProps {
  property: IEnhancedProperty;
  isWishlisted: boolean;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
  onViewDetails: (property: IEnhancedProperty) => void;
}

export function PropertyCard({
  property,
  isWishlisted,
  onToggleWishlist,
  onViewDetails,
}: PropertyCardProps) {
  const getPropertyIcon = (type: PropertyType) => {
    switch (type) {
      case 'apartment':
        return (
          <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-10.5h16.5M2 4.875C2 3.839 2.84 3 3.875 3h16.25c1.036 0 1.875.84 1.875 1.875v15.25c0 1.036-.84 1.875-1.875 1.875H3.875A1.875 1.875 0 012 20.125V4.875zM12 9.75v.008H12v-.008zM12 14.25v.008H12v-.008zM16.5 9.75v.008h-.008v-.008zm0 4.25v.008h-.008v-.008zm-9-4.25v.008H7.5v-.008zm0 4.25v.008H7.5v-.008z" />
          </svg>
        );
      case 'duplex':
        return (
          <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1.091m-4.5-7.841v12.302m-9.75 0H12.75" />
          </svg>
        );
      case 'commercial':
        return (
          <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72M6.75 18h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z" />
          </svg>
        );
      case 'land':
        return (
          <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.167V4.75m0 10.5v-1.5m6-7.083V4.75m0 10.5v-1.5M3.75 18h16.5M4.5 19.25h15m-15-12.75a1.5 1.5 0 011.5-1.5h12a1.5 1.5 0 01-1.5 1.5v9.5a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5v-9.5z" />
          </svg>
        );
    }
  };

  const statusVariant: Record<string, 'success' | 'info' | 'warning' | 'neutral'> = {
    available: 'success',
    occupied: 'info',
    maintenance: 'warning',
    inactive: 'neutral',
  };

  return (
    <div
      onClick={() => onViewDetails(property)}
      className="group flex flex-col bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 shadow-[var(--shadow-card)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      
      {/* Visual Header Illustration area */}
      <div className="relative h-52 bg-gradient-to-tr from-[var(--color-sidebar-bg)] to-[var(--color-primary)] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
        
        {/* Glow gradients */}
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-[var(--color-success)] opacity-10 filter blur-xl group-hover:scale-125 transition-transform duration-500" />
        <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-[var(--color-primary-light)] opacity-10 filter blur-lg" />
        
        {/* Blueprint line grid */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:16px_16px]" />

        {/* Floating elements */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex gap-1.5">
            {property.isPopular && (
              <Badge variant="warning" className="uppercase tracking-wider text-[10px] font-extrabold border-none shadow-sm">
                ★ Popular
              </Badge>
            )}
            <Badge variant={statusVariant[property.status] ?? 'neutral'} className="capitalize shadow-sm">
              {property.status}
            </Badge>
          </div>

          <button
            onClick={(e) => onToggleWishlist(property._id, e)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
              isWishlisted 
                ? 'bg-red-500 border-red-500 text-white shadow-md' 
                : 'bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-black/35'
            }`}
          >
            <svg className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>

        {/* Isometric SVG Container */}
        <div className="relative w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105">
          {getPropertyIcon(property.type)}
        </div>

        {/* Distance Indicator */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 bg-black/45 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
          <span>⚡ {property.walkMinutes} min walk</span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-4 right-4 z-10 bg-[var(--color-surface-raised)] text-[var(--color-primary)] font-bold text-sm px-3 py-1 rounded-xl shadow-md border border-[var(--color-border)]">
          ₦{property.rentAmount.toLocaleString()} <span className="text-[10px] text-[var(--color-text-secondary)] font-medium">/mo</span>
        </div>
      </div>

      {/* Card Info details */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] font-bold">
            <span className="flex items-center gap-1">📍 {property.estateZone}</span>
            <span>{property.distanceToCampus}</span>
          </div>
          
          <h3 className="mt-3 text-lg font-bold text-[var(--color-text-primary)] line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors font-display">
            {property.title}
          </h3>
          
          <p className="mt-2 text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
            {property.address}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-[var(--color-border)]">
            <span className="px-2 py-0.5 bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] text-[10px] font-bold rounded-md">
              🛏️ {property.bedrooms > 0 ? `${property.bedrooms} Bedrooms` : 'Studio'}
            </span>
            {property.amenities && property.amenities.slice(0, 3).map(am => (
              <span key={am} className="px-2 py-0.5 bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] text-[10px] font-bold rounded-md">
                ✓ {am}
              </span>
            ))}
            {property.amenities && property.amenities.length > 3 && (
              <span className="px-2 py-0.5 bg-[var(--color-surface-sunken)] text-[var(--color-primary)] text-[10px] font-extrabold rounded-md">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 pt-3 flex gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            className="w-full text-xs font-bold"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(property);
            }}
          >
            Details
          </Button>
          {property.status === 'available' && (
            <Button
              size="sm"
              className="w-full text-xs font-bold shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(property);
              }}
            >
              Rent Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
