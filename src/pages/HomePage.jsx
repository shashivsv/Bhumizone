import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyApi } from '../services/api/propertyApi';
import { useAuth } from '../context/AuthContext';
import { PropertyCard } from '../features/properties/components/PropertyCard';
import { InquiryModal } from '../features/inquiries/components/InquiryModal';
import { Button } from '../components/ui/Button';
import {
  Search,
  MapPin,
  Building2,
  Home,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Key,
} from 'lucide-react';
import { POPULAR_CITIES } from '../config/propertyConstants';

const CITY_IMAGES = {
  Mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop',
  Bengaluru: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop',
  'Delhi NCR': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop',
  Pune: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop',
  Hyderabad: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&auto=format&fit=crop',
  Ahmedabad: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop',
};

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [inquiryProperty, setInquiryProperty] = useState(null);

  // Hero search tab & state
  const [activeTab, setActiveTab] = useState('BUY'); // 'BUY' | 'RENT' | 'COMMERCIAL'
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await propertyApi.getProperties({}, user?.id);
        setFeaturedProperties(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured properties', err);
      }
    }
    loadFeatured();
  }, [user]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeTab === 'COMMERCIAL') {
      params.set('category', 'Commercial Office');
    } else {
      params.set('type', activeTab);
    }
    if (selectedCity && selectedCity !== 'ALL') {
      params.set('city', selectedCity);
    }
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 py-16 sm:py-24 text-white">
        {/* Background Image Overlay with deep slate tint */}
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&auto=format&fit=crop"
            alt="Luxury Architecture"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-slate-950 z-0" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 backdrop-blur-md mb-6">
            <Sparkles className="w-3.5 h-3.5" /> India's Most Trusted Property Marketplace
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Find Your Next Sanctuary with <span className="text-emerald-400">Total Transparency</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
            Connect directly with verified individual property owners and certified RERA real estate dealers. Verified titles, genuine pricing, zero spam.
          </p>

          {/* HERO SEARCH WIDGET */}
          <div className="mt-8 max-w-3xl mx-auto rounded-3xl bg-white/95 p-3 sm:p-4 text-slate-900 shadow-2xl backdrop-blur-md border border-white/20">
            {/* Search Type Tabs */}
            <div className="flex border-b border-slate-200/80 pb-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('BUY')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'BUY'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Buy Properties
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('RENT')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'RENT'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Rent Homes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('COMMERCIAL')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'COMMERCIAL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Commercial
              </button>
            </div>

            {/* Inputs & Search Trigger */}
            <form onSubmit={handleHeroSearch} className="mt-3 flex flex-col sm:flex-row items-center gap-2">
              {/* City Selector */}
              <div className="relative w-full sm:w-48 shrink-0">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-6 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                >
                  {POPULAR_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword / Locality input */}
              <div className="relative flex-1 w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Enter locality, project, or landmark (e.g. Worli, Whitefield)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Search Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shrink-0"
              >
                Search Now
              </Button>
            </form>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80 text-center">
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-white">100%</p>
              <p className="text-xs text-slate-400 font-medium">RERA Verified Titles</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-white">Zero</p>
              <p className="text-xs text-slate-400 font-medium">Hidden Brokerage Fee</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-white">5,000+</p>
              <p className="text-xs text-slate-400 font-medium">Active Inquiries</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-white">8 Cities</p>
              <p className="text-xs text-slate-400 font-medium">Pan-India Footprint</p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE TOP CITIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Properties by City
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Find prime residential and commercial hotspots across top metro hubs.
            </p>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            <span>Browse All Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {POPULAR_CITIES.slice(0, 6).map((city) => (
            <Link
              key={city}
              to={`/properties?city=${encodeURIComponent(city)}`}
              className="group relative aspect-4/5 overflow-hidden rounded-2xl bg-slate-900 shadow-xs transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={CITY_IMAGES[city] || CITY_IMAGES['Mumbai']}
                alt={city}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-75 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-sm font-bold truncate">{city}</p>
                <p className="text-[11px] text-emerald-400 font-medium">Explore Hub &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PROPERTIES SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <ShieldCheck className="w-4 h-4" /> Curated & Verified
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Luxury Listings
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Hand-picked properties verified by GharDekho ground inspectors.
            </p>
          </div>

          <Link to="/properties">
            <Button variant="outline" size="sm">
              View All Properties ({featuredProperties.length}+)
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onQuickInquiry={(p) => setInquiryProperty(p)}
            />
          ))}
        </div>
      </section>

      {/* VALUE PROPOSITION: BUYERS, OWNERS, DEALERS */}
      <section className="bg-slate-100/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tailored for Every Stakeholder
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              A high-trust marketplace balancing free owner discovery with enterprise dealer monetization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. BUYERS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 mb-4 font-bold">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">For Home Buyers & Tenants</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Browse verified properties with interactive Leaflet maps and Swiper galleries. Save favorites and send direct inquiry messages without fear of spam calls.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive Map & Landmark Search</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct WhatsApp with verified dealers</span>
                </li>
              </ul>
            </div>

            {/* 2. OWNERS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4 font-bold">
                <Key className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">For Individual Owners</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                List your residential property for sale or rent 100% free. No mandatory subscription required. Your direct phone number connects you straight to serious buyers.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free listing creation & image uploads</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct contact with prospective tenants</span>
                </li>
              </ul>
            </div>

            {/* 3. DEALERS */}
            <div className="rounded-2xl border border-amber-300 bg-amber-50/40 p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800 mb-4 font-bold">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">For Certified Real Estate Dealers</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                List unlimited properties without an upfront fee. Subscribe to 3, 6, or 12 month plans to unlock unmasked telephone visibility, direct WhatsApp leads, and search priority.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unmasked phone visibility on active plans</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>3, 6, 12 Month flexible packages</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DEALER SUBSCRIPTION TEASER BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full mb-3">
              Dealer Network Opportunity
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Are you a Real Estate Broker or Agency?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Showcase your entire inventory to active home seekers. Upgrade to an active dealer plan to display your unmasked contact number and receive instant direct telephone calls.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link to="/pricing">
              <Button variant="amber" size="md" className="w-full sm:w-auto">
                Explore Dealer Plans (3, 6, 12 Mo)
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="md" className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10">
                Register as Dealer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Lead Inquiry Modal */}
      {inquiryProperty && (
        <InquiryModal
          isOpen={Boolean(inquiryProperty)}
          onClose={() => setInquiryProperty(null)}
          property={inquiryProperty}
        />
      )}
    </div>
  );
}
