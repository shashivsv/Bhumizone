import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { propertyApi } from '../../../services/api/propertyApi';
import { PropertyCard } from '../../properties/components/PropertyCard';
import { InquiryModal } from '../../inquiries/components/InquiryModal';
import { PageLoader } from '../../../components/feedback/PageLoader';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { Button } from '../../../components/ui/Button';
import { Heart } from 'lucide-react';

export function SavedPropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inquiryProperty, setInquiryProperty] = useState(null);

  useEffect(() => {
    async function loadSaved() {
      setLoading(true);
      try {
        const all = await propertyApi.getProperties({}, user?.id);
        const savedIds = user?.savedProperties || [];
        setProperties(all.filter((p) => savedIds.includes(p.id)));
      } catch (err) {
        console.error('Failed to load saved properties', err);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      loadSaved();
    }
  }, [user]);

  if (loading) {
    return <PageLoader message="Loading your saved wishlist..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Saved Properties
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Compare your shortlisted homes, monitor price updates, and contact sellers directly.
        </p>
      </div>

      {properties.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Browse our verified listings and tap the heart icon on any property to save it here."
          action={
            <Link to="/properties">
              <Button variant="primary">Explore Properties</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onQuickInquiry={(p) => setInquiryProperty(p)}
            />
          ))}
        </div>
      )}

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
