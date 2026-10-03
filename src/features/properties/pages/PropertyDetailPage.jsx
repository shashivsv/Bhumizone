import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyApi } from '../../../services/api/propertyApi';
import { useAuth } from '../../../context/AuthContext';
import { formatCurrencyINR } from '../../../utils/currencyFormatter';
import { PropertyGallery } from '../components/PropertyGallery';
import { PropertyKeyFeatures } from '../components/PropertyKeyFeatures';
import { PropertyAmenities } from '../components/PropertyAmenities';
import { PropertyContactBox } from '../components/PropertyContactBox';
import { PropertyMap } from '../components/PropertyMap';
import { InquiryModal } from '../../inquiries/components/InquiryModal';
import { PageLoader } from '../../../components/feedback/PageLoader';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import {
  MapPin,
  Heart,
  Share2,
  ShieldCheck,
  Eye,
  MessageSquare,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';

export function PropertyDetailPage() {
  const { slugOrId } = useParams();
  const { user, toggleFavorite } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      try {
        const data = await propertyApi.getPropertyById(slugOrId, user?.id);
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [slugOrId, user]);

  if (loading) {
    return <PageLoader message="Loading property details..." />;
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <EmptyState
          title="Property Not Found"
          description="The listing you are looking for may have been removed or is temporarily unavailable."
          action={
            <Link to="/properties">
              <Button variant="primary">Browse All Properties</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const isSaved = user?.savedProperties?.includes(property.id);
  const isRental = property.type === 'RENT';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Property link copied to clipboard!');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb & Top Actions */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/properties" className="hover:text-emerald-600 transition-colors">
            Properties
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold truncate max-w-[200px]">
            {property.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(property.id)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${
                isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
              }`}
            />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Header / Title Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={isRental ? 'indigo' : 'emerald'} size="sm">
              For {property.type}
            </Badge>
            <Badge variant="slate" size="sm">
              {property.category}
            </Badge>
            {property.isVerified && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> RERA Verified
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {property.title}
          </h1>

          <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-600">
            <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{property.address || `${property.locality}, ${property.city}`}</span>
          </p>
        </div>

        {/* Price Box */}
        <div className="text-left md:text-right">
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrencyINR(property.price, isRental)}
          </p>
          {property.pricePerSqFt && (
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              ₹ {property.pricePerSqFt.toLocaleString('en-IN')} / sq.ft
            </p>
          )}
        </div>
      </div>

      {/* 2-Column Layout: Gallery + Specs (Left) & Sticky Contact Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Swiper Gallery */}
          <PropertyGallery images={property.images} title={property.title} />

          {/* Key Specifications Grid */}
          <PropertyKeyFeatures property={property} />

          {/* Detailed Description */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3 tracking-tight">
              About this Property
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities Facility Grid */}
          <PropertyAmenities amenities={property.amenities} />

          {/* Location & Map */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">
              Location & Neighborhood
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Explore the exact landmark and surrounding connectivity in {property.locality}, {property.city}.
            </p>
            <PropertyMap
              properties={[property]}
              selectedProperty={property}
              height="380px"
            />
          </div>
        </div>

        {/* Right Sticky Sidebar: Contact Box with Masking Rule */}
        <div className="space-y-6">
          <div className="sticky top-20 space-y-6">
            <PropertyContactBox
              property={property}
              onOpenInquiry={() => setInquiryModalOpen(true)}
            />

            {/* Quick Safety Tips */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-5 text-xs text-slate-600 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> GharDekho Trust & Safety
              </h4>
              <p>• Never transfer booking token amounts without visiting the site in person.</p>
              <p>• Verify society ownership documents and RERA approvals before signing agreements.</p>
              <p>• Certified dealers have their contact visibility verified by our admin team.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Lead Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        property={property}
      />
    </div>
  );
}
