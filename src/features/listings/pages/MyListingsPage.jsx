import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { propertyApi } from '../../../services/api/propertyApi';
import { StatusBadge } from '../../../components/feedback/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { formatCurrencyINR } from '../../../utils/currencyFormatter';
import { formatDate } from '../../../utils/dateFormatter';
import { PlusCircle, Eye, Edit, AlertCircle, Building2 } from 'lucide-react';
import { PageLoader } from '../../../components/feedback/PageLoader';
import { EmptyState } from '../../../components/feedback/EmptyState';

export function MyListingsPage() {
  const { user, role } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const newPropertyPath = role === 'DEALER' ? '/dealer/properties/new' : '/owner/properties/new';

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
        const data = await propertyApi.getMyProperties(user.id);
        setProperties(data);
      } catch (err) {
        console.error('Failed to load listings', err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) {
      loadProperties();
    }
  }, [user]);

  if (loading) {
    return <PageLoader message="Loading your property portfolio..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {role === 'DEALER' ? 'Dealer Inventory & Listings' : 'My Properties'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Manage your active property portfolio, track moderation progress, and inspect buyer leads.
          </p>
        </div>

        <Link to={newPropertyPath}>
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Post New Property
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No properties listed yet"
          description="You haven't added any properties to your portfolio. Create your first listing to start receiving buyer leads."
          action={
            <Link to={newPropertyPath}>
              <Button variant="primary">Create Property Listing</Button>
            </Link>
          }
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Property</th>
                  <th className="py-3.5 px-4">Pricing</th>
                  <th className="py-3.5 px-4">Category & BHK</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Inquiries</th>
                  <th className="py-3.5 px-4">Listed Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Property Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120'}
                          alt={prop.title}
                          className="h-12 w-16 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <Link
                            to={`/properties/${prop.slug || prop.id}`}
                            className="font-bold text-slate-900 hover:text-emerald-700 truncate block"
                          >
                            {prop.title}
                          </Link>
                          <p className="text-[11px] text-slate-500 truncate">
                            {prop.locality}, {prop.city}
                          </p>
                          {prop.rejectionReason && (
                            <p className="mt-0.5 text-[10px] text-rose-600 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Feedback: {prop.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatCurrencyINR(prop.price, prop.type === 'RENT')}
                    </td>

                    {/* Specs */}
                    <td className="py-3 px-4">
                      <span className="font-semibold block">{prop.category}</span>
                      <span className="text-slate-500 text-[11px]">{prop.bhk}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <StatusBadge status={prop.status} />
                    </td>

                    {/* Inquiries Count */}
                    <td className="py-3 px-4 font-bold text-slate-800">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                        {prop.inquiriesCount || 0} Leads
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-slate-500">{formatDate(prop.createdAt)}</td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/properties/${prop.slug || prop.id}`}>
                          <Button variant="ghost" size="xs" title="View Property">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
