import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { formatCurrencyINR } from '../../../utils/currencyFormatter';
import { ROLES } from '../../../config/roles';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ShieldCheck,
  Building,
  User,
  ArrowRight,
  PhoneOff,
} from 'lucide-react';

export function PropertyCard({ property, onQuickInquiry }) {
  const { user, toggleFavorite } = useAuth();
  const isSaved = user?.savedProperties?.includes(property.id);

  const images = property.images?.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'];

  const listedBy = property.listedBy || {};
  const isDealer = listedBy.role === ROLES.DEALER;
  const isOwner = listedBy.role === ROLES.OWNER;
  const isRental = property.type === 'RENT';
  const isContactHidden = listedBy.contactInfo?.contactHidden;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50">
      {/* Top Image Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={images[0]}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xs ${
                isRental ? 'bg-indigo-600' : 'bg-emerald-600'
              }`}
            >
              For {property.type}
            </span>

            {property.isVerified && (
              <span className="flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-[11px] font-bold text-emerald-800 shadow-xs backdrop-blur-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Verified
              </span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={isSaved ? 'Remove from favorites' : 'Save property'}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 hover:text-rose-600 cursor-pointer"
          >
            <Heart
              className={`h-4.5 w-4.5 transition-colors ${
                isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
              }`}
            />
          </button>
        </div>

        {/* Bottom Image Overlay: Price */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <p className="text-xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {formatCurrencyINR(property.price, isRental)}
            </p>
            {property.pricePerSqFt && (
              <p className="text-[11px] font-medium text-slate-200 drop-shadow-xs">
                ₹ {property.pricePerSqFt.toLocaleString('en-IN')} / sq.ft
              </p>
            )}
          </div>

          <span className="rounded-md bg-slate-900/80 px-2 py-0.5 text-[11px] font-semibold text-slate-200 backdrop-blur-xs">
            {property.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Title */}
        <Link
          to={`/properties/${property.slug || property.id}`}
          className="group-hover:text-emerald-700 transition-colors"
        >
          <h3 className="line-clamp-1 text-base font-bold text-slate-900">
            {property.title}
          </h3>
        </Link>

        {/* Locality */}
        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            {property.locality}, {property.city}
          </span>
        </p>

        {/* Specs Pills */}
        <div className="mt-3.5 flex items-center justify-between border-y border-slate-100 py-2.5 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1.5" title="BHK configuration">
            <Bed className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{property.bhk}</span>
          </div>

          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1.5" title="Bathrooms">
              <Bath className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}

          <div className="flex items-center gap-1.5" title="Carpet Area">
            <Maximize2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{property.carpetArea} sq.ft</span>
          </div>
        </div>

        {/* Seller Info & Contact Indicator */}
        <div className="mt-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={
                listedBy.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60'
              }
              alt={listedBy.name || 'Seller'}
              className="h-6 w-6 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="truncate">
              <span className="font-bold text-slate-800 truncate block text-[11px]">
                {listedBy.agencyName || listedBy.name || 'Owner'}
              </span>
              <span className="text-[10px] text-slate-600 uppercase font-semibold">
                {isOwner ? 'Direct Owner' : 'Certified Dealer'}
              </span>
            </div>
          </div>

          {/* Privacy badge for dealer if phone is masked */}
          {isDealer && isContactHidden && (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
              title="Dealer phone hidden by platform privacy rule"
            >
              <PhoneOff className="w-3 h-3 text-amber-600" /> Masked
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 flex items-center gap-2">
          <Link
            to={`/properties/${property.slug || property.id}`}
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full">
              Details
            </Button>
          </Link>

          {onQuickInquiry && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => onQuickInquiry(property)}
            >
              Inquire
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
