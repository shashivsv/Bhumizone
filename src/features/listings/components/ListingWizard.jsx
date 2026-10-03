import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { propertyApi } from '../../../services/api/propertyApi';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import {
  TRANSACTION_TYPES,
  PROPERTY_CATEGORIES,
  BHK_OPTIONS,
  FURNISHING_OPTIONS,
  POPULAR_CITIES,
  AMENITIES_LIST,
  PROPERTY_STATUS,
} from '../../../config/propertyConstants';
import { formatCurrencyINR } from '../../../utils/currencyFormatter';
import { toast } from 'sonner';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  Plus,
  Trash2,
  MapPin,
  Building2,
  Image as ImageIcon,
  ShieldCheck,
} from 'lucide-react';

const PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
];

export function ListingWizard({ initialData = null }) {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    type: initialData?.type || 'BUY',
    category: initialData?.category || 'Apartment',
    city: initialData?.city || 'Mumbai',
    locality: initialData?.locality || '',
    address: initialData?.address || '',
    price: initialData?.price || '',
    carpetArea: initialData?.carpetArea || '',
    superBuiltUpArea: initialData?.superBuiltUpArea || '',
    bhk: initialData?.bhk || '2 BHK',
    bathrooms: initialData?.bathrooms || 2,
    furnishing: initialData?.furnishing || 'Semi-Furnished',
    floor: initialData?.floor || 5,
    totalFloors: initialData?.totalFloors || 14,
    facing: initialData?.facing || 'East',
    description: initialData?.description || '',
    amenities: initialData?.amenities || ['parking', 'security', 'lift', 'power_backup'],
    images: initialData?.images || [PRESET_PHOTOS[0], PRESET_PHOTOS[1]],
  });

  const [customImageUrl, setCustomImageUrl] = useState('');

  const handleAmenityToggle = (amenityId) => {
    const current = formData.amenities || [];
    const exists = current.includes(amenityId);
    setFormData({
      ...formData,
      amenities: exists
        ? current.filter((id) => id !== amenityId)
        : [...current, amenityId],
    });
  };

  const handleAddImage = (url) => {
    if (!url) return;
    setFormData({
      ...formData,
      images: [...formData.images, url],
    });
    setCustomImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleNext = () => {
    if (step === 1 && !formData.title) {
      toast.error('Please enter a descriptive property title.');
      return;
    }
    if (step === 2 && (!formData.city || !formData.locality)) {
      toast.error('Please enter city and locality details.');
      return;
    }
    if (step === 3 && (!formData.price || !formData.carpetArea)) {
      toast.error('Please enter property price and carpet area.');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (isDraft = false) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        carpetArea: Number(formData.carpetArea),
        superBuiltUpArea: Number(formData.superBuiltUpArea || formData.carpetArea),
        status: isDraft ? PROPERTY_STATUS.DRAFT : PROPERTY_STATUS.PENDING_APPROVAL,
        coordinates: {
          lat: 19.076 + (Math.random() - 0.5) * 0.1,
          lng: 72.8777 + (Math.random() - 0.5) * 0.1,
        },
      };

      await propertyApi.createProperty(payload, user.id);

      if (isDraft) {
        toast.info('Listing saved to Drafts.');
      } else {
        toast.success(
          'Property submitted successfully! It has been placed in the moderation queue for admin review.'
        );
      }

      const redirectPath = role === 'DEALER' ? '/dealer/properties' : '/owner/properties';
      navigate(redirectPath);
    } catch (err) {
      toast.error(err.message || 'Failed to submit property.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm">
      {/* Wizard Progress Header */}
      <div className="mb-8 border-b border-slate-100 pb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
          <span>Step {step} of 5</span>
          <span className="text-emerald-700">
            {step === 1 && 'Basic Information'}
            {step === 2 && 'Location & Address'}
            {step === 3 && 'Specifications & Price'}
            {step === 4 && 'Amenities & Photos'}
            {step === 5 && 'Review & Publish'}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-slate-900">1. Property Purpose & Title</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Transaction Type
              </label>
              <div className="flex gap-2">
                {TRANSACTION_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t.value })}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      formData.type === t.value
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    For {t.label}
                  </button>
                ))}
              </div>
            </div>

            <Select
              label="Property Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={PROPERTY_CATEGORIES}
            />
          </div>

          <Input
            label="Listing Title"
            required
            placeholder="e.g. 3 BHK Sea-View Luxury Apartment in Worli"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            helperText="Write a clear, attractive title highlighting BHK, view, or project name."
          />

          <Textarea
            label="Property Description"
            rows={4}
            placeholder="Describe the unit layout, sunlight, balcony views, fittings, and proximity to transit..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      )}

      {/* STEP 2: Location */}
      {step === 2 && (
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-slate-900">2. Location Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="City"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              options={POPULAR_CITIES.map((c) => ({ value: c, label: c }))}
            />

            <Input
              label="Locality / Sector"
              required
              placeholder="e.g. Worli, Whitefield, Indiranagar"
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
            />
          </div>

          <Input
            label="Full Street Address / Society Name"
            placeholder="e.g. Tower 2, Flat 1402, Lodha Park, Worli, Mumbai - 400018"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
      )}

      {/* STEP 3: Specs & Pricing */}
      {step === 3 && (
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-slate-900">3. Specifications & Pricing</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={formData.type === 'RENT' ? 'Monthly Rent (in ₹)' : 'Expected Price (in ₹)'}
              type="number"
              required
              placeholder="e.g. 45000000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              helperText={formData.price ? `Formatted: ${formatCurrencyINR(formData.price, formData.type === 'RENT')}` : ''}
            />

            <Input
              label="Carpet Area (in sq.ft)"
              type="number"
              required
              placeholder="e.g. 1450"
              value={formData.carpetArea}
              onChange={(e) => setFormData({ ...formData, carpetArea: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="BHK Configuration"
              value={formData.bhk}
              onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
              options={BHK_OPTIONS.map((b) => ({ value: b, label: b }))}
            />

            <Select
              label="Furnishing Status"
              value={formData.furnishing}
              onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
              options={FURNISHING_OPTIONS}
            />

            <Input
              label="Bathrooms"
              type="number"
              min="0"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
            />
          </div>
        </div>
      )}

      {/* STEP 4: Amenities & Photos */}
      {step === 4 && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">4. Amenities & High-Res Photos</h3>

          {/* Amenities Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Project Amenities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AMENITIES_LIST.map((item) => {
                const isSelected = formData.amenities?.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAmenityToggle(item.id)}
                    className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border border-emerald-600 text-emerald-900'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2
                      className={`h-4 w-4 ${
                        isSelected ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photos Management */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Property Images ({formData.images.length})
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative aspect-16/10 rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={img} alt="Property" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 rounded-md bg-rose-600 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Image URL or Sample Photo */}
            <div className="flex gap-2">
              <Input
                placeholder="Paste an image URL (Unsplash or direct image link)..."
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
              />
              <Button
                variant="outline"
                size="md"
                onClick={() => handleAddImage(customImageUrl)}
                disabled={!customImageUrl}
              >
                Add URL
              </Button>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span>Quick add presets:</span>
              {PRESET_PHOTOS.slice(0, 3).map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddImage(url)}
                  className="text-emerald-700 underline font-semibold cursor-pointer"
                >
                  Sample #{i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Submit */}
      {step === 5 && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">5. Review Your Listing</h3>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 space-y-4 text-xs text-slate-700">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-bold text-sm text-slate-900">{formData.title}</span>
              <span className="text-base font-extrabold text-emerald-800">
                {formatCurrencyINR(formData.price, formData.type === 'RENT')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-600 block">Category</span>
                <span className="font-bold">{formData.category} (For {formData.type})</span>
              </div>
              <div>
                <span className="text-slate-600 block">Location</span>
                <span className="font-bold">{formData.locality}, {formData.city}</span>
              </div>
              <div>
                <span className="text-slate-600 block">Carpet Area</span>
                <span className="font-bold">{formData.carpetArea} sq.ft</span>
              </div>
              <div>
                <span className="text-slate-600 block">Configuration</span>
                <span className="font-bold">{formData.bhk} ({formData.furnishing})</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-600 block mb-1">Selected Amenities:</span>
              <p className="font-semibold text-slate-800">
                {formData.amenities?.join(', ') || 'None selected'}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Moderation Workflow Notice:</p>
              <p className="mt-0.5 text-emerald-900 leading-relaxed">
                When you click "Submit for Approval", the property will transition to{' '}
                <span className="font-bold">Pending Approval</span>. The GharDekho admin team will inspect and verify your listing before it is published to the public marketplace.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
        {step > 1 ? (
          <Button variant="outline" size="sm" onClick={handlePrev}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {step === 5 ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
              >
                Save as Draft
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleSubmit(false)}
                isLoading={isSubmitting}
              >
                Submit for Approval
              </Button>
            </>
          ) : (
            <Button variant="primary" size="md" onClick={handleNext}>
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
