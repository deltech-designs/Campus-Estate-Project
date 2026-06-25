'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { propertiesService } from '@/services/properties.service';
import type { PropertyType } from '@ems/shared';
import type { IEnhancedProperty } from './types';

// Subcomponents imports
import { LandingHeader } from './LandingHeader';
import { LandingHero } from './LandingHero';
import { LandingSearchPanel } from './LandingSearchPanel';
import { PropertyGrid } from './PropertyGrid';
import { LandingFeatures } from './LandingFeatures';
import { LandingStats } from './LandingStats';
import { LandingTestimonials } from './LandingTestimonials';
import { PropertyDetailModal } from './PropertyDetailModal';

const MOCK_PROPERTIES: IEnhancedProperty[] = [
  {
    _id: 'mock-1',
    title: 'Ivy Heights Luxury Studio',
    type: 'apartment',
    status: 'available',
    address: '12 University Road, Yaba, Lagos',
    rentAmount: 180000,
    bedrooms: 1,
    estateZone: 'North Campus',
    amenities: ['High-speed Wi-Fi', '24/7 Power', 'AC', 'Water Heater', 'Smart Lock', 'Gated Security'],
    description: 'A premium, modern studio designed specifically for the focused student. Featuring floor-to-ceiling windows, an ergonomic workspace, and a private kitchenette. Located just a short walk from the North Campus gate.',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    distanceToCampus: '200m from North Gate',
    walkMinutes: 3,
    landlordName: 'Engr. Benson',
    landlordRating: 4.8,
    landlordResponse: 'Under 1 hour',
    isPopular: true,
  },
  {
    _id: 'mock-2',
    title: 'The Pines Quad Duplex',
    type: 'duplex',
    status: 'available',
    address: '5 Forest Avenue, Akoka, Lagos',
    rentAmount: 450000,
    bedrooms: 4,
    estateZone: 'West Gate',
    amenities: ['Study Room', 'Shared Lounge', 'Swimming Pool', 'CCTV', 'Parking', 'Washing Machine'],
    description: 'Perfect for groups or roommate networks! This spacious 4-bedroom duplex provides a balance of private study spaces and premium communal living. Includes access to a private pool and courtyard.',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    distanceToCampus: '800m from West Gate',
    walkMinutes: 9,
    landlordName: 'Alhaji Rasaq',
    landlordRating: 4.6,
    landlordResponse: 'Under 2 hours',
    isPopular: false,
  },
  {
    _id: 'mock-3',
    title: 'Summit Coworking & Lounge',
    type: 'commercial',
    status: 'available',
    address: '18 South Boulevard, Akoka, Lagos',
    rentAmount: 90000,
    bedrooms: 0,
    estateZone: 'South Campus',
    amenities: ['Coffee Bar', 'Meeting Rooms', 'Fiber Internet', 'Chill Zone', 'Backup Gen'],
    description: 'Unlock your productivity at Summit. A premium shared workspace tailored for student builders, designers, and startups. Monthly pass includes free premium coffee and high-speed fiber internet.',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    distanceToCampus: '1.2km from South Gate',
    walkMinutes: 14,
    landlordName: 'Summit Hubs Ltd',
    landlordRating: 4.9,
    landlordResponse: 'Instant response',
    isPopular: true,
  },
  {
    _id: 'mock-4',
    title: 'Campus View Premium Ensuite',
    type: 'apartment',
    status: 'occupied',
    address: '3 Campus View Close, Yaba, Lagos',
    rentAmount: 150000,
    bedrooms: 1,
    estateZone: 'Main Gate',
    amenities: ['Furnished', 'Gym Access', '24/7 Guards', 'Balcony', 'Laundry Room'],
    description: 'Enjoy stunning campus views from your private balcony. Fully furnished with high-end appliances, security gates, and a communal wellness gym. Walkable distance to the main lecture theaters.',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    distanceToCampus: '400m from Main Gate',
    walkMinutes: 5,
    landlordName: 'Dr. (Mrs) Adeleke',
    landlordRating: 4.7,
    landlordResponse: 'Under 3 hours',
    isPopular: false,
  },
  {
    _id: 'mock-5',
    title: 'Oakwood Residence Block B',
    type: 'apartment',
    status: 'available',
    address: '22 Palace Way, Yaba, Lagos',
    rentAmount: 220000,
    bedrooms: 2,
    estateZone: 'North Campus',
    amenities: ['Balcony', 'Modern Kitchen', 'Prepaid Meter', 'Water Treatment'],
    description: 'A gorgeous, newly renovated 2-bedroom apartment with modern finishes. Ideal for sharing between two students. Safe neighbourhood with access control and a reliable estate borehole.',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    distanceToCampus: '600m from North Gate',
    walkMinutes: 7,
    landlordName: 'Engr. Benson',
    landlordRating: 4.8,
    landlordResponse: 'Under 1 hour',
    isPopular: false,
  },
  {
    _id: 'mock-6',
    title: 'Prime Commercial Dev Plot',
    type: 'land',
    status: 'available',
    address: 'Plot 14 Academic Square, Akoka, Lagos',
    rentAmount: 850000,
    bedrooms: 0,
    estateZone: 'West Gate',
    amenities: ['Fenced', 'Main Road Access', 'Perfect Drainage', 'Dry Land'],
    description: 'A strategically located plot of land in a bustling student district. Ideal for developers looking to build a private hostel, commercial block, or retail hub serving the university community.',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    distanceToCampus: '1.5km from West Gate',
    walkMinutes: 18,
    landlordName: 'Eld. Ogunlana',
    landlordRating: 4.5,
    landlordResponse: 'Same day',
    isPopular: false,
  },
];

export function LandingView() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Fetch live properties from backend database if authenticated
  const { data: liveProperties } = useQuery({
    queryKey: ['properties'],
    queryFn: propertiesService.getAll,
    enabled: isAuthenticated,
    retry: false,
  });

  // State controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | PropertyType>('all');
  const [selectedBedrooms, setSelectedBedrooms] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Modal profile controls
  const [selectedProperty, setSelectedProperty] = useState<IEnhancedProperty | null>(null);
  const [showApplySuccess, setShowApplySuccess] = useState(false);

  // Modal Calculator planner states
  const [leaseMonths, setLeaseMonths] = useState(12);
  const [includeUtilities, setIncludeUtilities] = useState(true);

  // Combine mock properties and live properties
  const allProperties = useMemo(() => {
    if (!liveProperties || liveProperties.length === 0) return MOCK_PROPERTIES;

    const parsedLives: IEnhancedProperty[] = liveProperties.map(p => ({
      ...p,
      description: `A beautifully situated ${p.type} in the ${p.estateZone} district. Features verified amenities, proximity indicators, and smart contract setup. Contact landlord directly inside the dashboard.`,
      distanceToCampus: 'Short walk from Campus Gates',
      walkMinutes: 8,
      landlordName: 'Verified EMS Owner',
      landlordRating: 4.8,
      landlordResponse: 'Under 30 minutes',
      isPopular: false,
    }));

    return [...parsedLives, ...MOCK_PROPERTIES];
  }, [liveProperties]);

  // Extract unique zones
  const zones = useMemo(() => {
    const set = new Set<string>();
    allProperties.forEach(p => {
      if (p.estateZone) set.add(p.estateZone);
    });
    return Array.from(set);
  }, [allProperties]);

  // Filter properties list
  const filteredProperties = useMemo(() => {
    return allProperties.filter(p => {
      if (p.isDeleted) return false;

      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.estateZone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesZone = selectedZone === 'all' || p.estateZone === selectedZone;
      const matchesType = activeTab === 'all' || p.type === activeTab;

      let matchesBedrooms = true;
      if (selectedBedrooms !== 'all') {
        if (selectedBedrooms === '4+') {
          matchesBedrooms = p.bedrooms >= 4;
        } else if (selectedBedrooms === '0') {
          matchesBedrooms = p.bedrooms === 0;
        } else {
          matchesBedrooms = p.bedrooms === parseInt(selectedBedrooms, 10);
        }
      }

      let matchesPrice = true;
      if (priceRange !== 'all') {
        if (priceRange === 'under-150') {
          matchesPrice = p.rentAmount < 150000;
        } else if (priceRange === '150-300') {
          matchesPrice = p.rentAmount >= 150000 && p.rentAmount <= 300000;
        } else if (priceRange === 'above-300') {
          matchesPrice = p.rentAmount > 300000;
        }
      }

      return matchesSearch && matchesZone && matchesType && matchesBedrooms && matchesPrice;
    });
  }, [allProperties, searchTerm, selectedZone, activeTab, selectedBedrooms, priceRange]);

  // Wishlist toggle callback
  const handleToggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Cost calculator compute inside modal
  const computedPricing = useMemo(() => {
    if (!selectedProperty) return { base: 0, service: 0, total: 0 };
    const baseTotal = selectedProperty.rentAmount * leaseMonths;
    const serviceFee = includeUtilities ? 15000 * leaseMonths : 0;
    return {
      base: baseTotal,
      service: serviceFee,
      total: baseTotal + serviceFee,
    };
  }, [selectedProperty, leaseMonths, includeUtilities]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedZone('all');
    setActiveTab('all');
    setSelectedBedrooms('all');
    setPriceRange('all');
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      window.location.href = `/register?from=/?apply=${selectedProperty?._id}`;
      return;
    }
    setShowApplySuccess(true);
    setTimeout(() => {
      setShowApplySuccess(false);
      setSelectedProperty(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)] relative overflow-hidden">
      
      {/* Dynamic graphic backgrounds */}
      <div className="absolute inset-0 -z-30 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(90%_0.01_248/0.35)_1px,transparent_1px),linear-gradient(to_bottom,oklch(90%_0.01_248/0.35)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,oklch(85%_0.08_248/0.25)_0%,transparent_70%)] filter blur-3xl" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,oklch(90%_0.05_155/0.2)_0%,transparent_60%)] filter blur-3xl" />
      </div>

      {/* Navigation Top bar */}
      <LandingHeader isAuthenticated={isAuthenticated} isAuthLoading={isAuthLoading} />

      {/* Main hero page container */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-36 overflow-hidden">
        <LandingHero />
        
        {/* Search selectors grid panel */}
        <LandingSearchPanel
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedBedrooms={selectedBedrooms}
          setSelectedBedrooms={setSelectedBedrooms}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          zones={zones}
          totalCount={filteredProperties.length}
          onReset={handleResetFilters}
        />
      </section>

      {/* Grid listing showcase */}
      <PropertyGrid
        properties={filteredProperties}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onViewDetails={setSelectedProperty}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleResetFilters}
      />

      {/* Capabilities feature columns */}
      <LandingFeatures />

      {/* Counter metrics bar */}
      <LandingStats />

      {/* Client reviews column slider */}
      <LandingTestimonials />

      {/* Detailed showcase profile drawer */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => {
          setSelectedProperty(null);
          setShowApplySuccess(false);
        }}
        isAuthenticated={isAuthenticated}
        onApply={handleApply}
        showApplySuccess={showApplySuccess}
        leaseMonths={leaseMonths}
        setLeaseMonths={setLeaseMonths}
        includeUtilities={includeUtilities}
        setIncludeUtilities={setIncludeUtilities}
        computedPricing={computedPricing}
      />

      {/* Institutional footer */}
      <footer className="bg-[var(--color-sidebar-bg)] text-[var(--color-sidebar-text)] py-16 mt-auto border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold font-display">E</span>
              </div>
              <span className="text-lg font-bold text-white font-display">CampusEstate</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leading the digital transformation of university housing, tenant portals, and facility maintenance management.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Browse Zones</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li><a href="#properties" className="hover:text-white transition-colors">North Campus Residence</a></li>
              <li><a href="#properties" className="hover:text-white transition-colors">West Gate Hostels</a></li>
              <li><a href="#properties" className="hover:text-white transition-colors">South Gate Flatlets</a></li>
              <li><a href="#properties" className="hover:text-white transition-colors">Main Campus Gate Hubs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">System Access</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li><a href="/login" className="hover:text-white transition-colors">Student Login</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Landlord / Owner Portal</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">Create Tenant Account</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Maintenance Handyman Apply</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Join News Alerts</h4>
            <p className="text-xs text-slate-400 font-normal">Receive instant updates when new bedspaces open near your campus.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Student email address"
                className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white text-white transition-colors"
              />
              <button className="px-4 py-2.5 bg-white text-[var(--color-primary)] hover:bg-slate-200 text-xs font-bold rounded-xl shadow transition-all cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Campus Estate System (EMS). Built for standard institutional housing. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
