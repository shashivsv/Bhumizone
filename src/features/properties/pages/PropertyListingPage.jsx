import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyApi } from '../../../services/api/propertyApi';
import { useAuth } from '../../../context/AuthContext';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyFilterBar } from '../components/PropertyFilterBar';
import { PropertyMap } from '../components/PropertyMap';
import { InquiryModal } from '../../inquiries/components/InquiryModal';
import { PageLoader } from '../../../components/feedback/PageLoader';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { LayoutGrid, Map, ArrowUpDown } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export function PropertyListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [selectedInquiryProperty, setSelectedInquiryProperty] = useState(null);

  // Parse filters from URL search parameters
  const filters = {
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || 'ALL',
    city: searchParams.get('city') || 'ALL',
    category: searchParams.get('category') || 'ALL',
    bhk: searchParams.getAll('bhk'),
    sortBy: searchParams.get('sortBy') || 'newest',
  };

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.type && newFilters.type !== 'ALL') params.set('type', newFilters.type);
    if (newFilters.city && newFilters.city !== 'ALL') params.set('city', newFilters.city);
    if (newFilters.category && newFilters.category !== 'ALL') params.set('category', newFilters.category);
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
    if (newFilters.bhk && newFilters.bhk.length > 0) {
      newFilters.bhk.forEach((b) => params.append('bhk', b));
    }
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
        const data = await propertyApi.getProperties(filters, user?.id);
        setProperties(data);
      } catch (err) {
        console.error('Failed to load properties', err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, [searchParams, user]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Title & Breadcrumb */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Verified Properties
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Discover verified apartments, villas, and commercial spaces across India.
          </p>
        </div>

        {/* View Toggle (Grid / Map) */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-200/80 p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar Component */}
      <PropertyFilterBar
        filters={filters}
        onChange={updateFilters}
        onReset={handleResetFilters}
      />

      {/* Results Header: Count & Sorting */}
      <div className="mt-6 mb-4 flex items-center justify-between text-xs text-slate-600">
        <p className="font-semibold">
          Showing <span className="text-slate-900 font-bold">{properties.length}</span> verified properties
        </p>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline font-semibold">Sort by:</span>
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => updateFilters({ ...filters, sortBy: e.target.value })}
            className="rounded-lg border border-slate-300 bg-white py-1 px-2.5 text-xs font-semibold text-slate-800 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <PageLoader message="Fetching verified properties..." />
      ) : properties.length === 0 ? (
        <EmptyState
          title="No properties match your criteria"
          description="Try broadening your search locality, clearing BHK filters, or selecting All Cities."
          action={
            <Button variant="primary" size="sm" onClick={handleResetFilters}>
              Clear All Filters
            </Button>
          }
        />
      ) : viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PropertyMap properties={properties} height="650px" />
          </div>
          <div className="space-y-4 max-h-[650px] overflow-y-auto pr-1">
            {properties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onQuickInquiry={(p) => setSelectedInquiryProperty(p)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onQuickInquiry={(p) => setSelectedInquiryProperty(p)}
            />
          ))}
        </div>
      )}

      {/* Inquiry Modal */}
      {selectedInquiryProperty && (
        <InquiryModal
          isOpen={Boolean(selectedInquiryProperty)}
          onClose={() => setSelectedInquiryProperty(null)}
          property={selectedInquiryProperty}
        />
      )}
    </div>
  );
}
