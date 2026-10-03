import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../../services/api/propertyApi';
import { StatusBadge } from '../../../components/feedback/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import { formatCurrencyINR } from '../../../utils/currencyFormatter';
import { formatDate } from '../../../utils/dateFormatter';
import { PageLoader } from '../../../components/feedback/PageLoader';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { toast } from 'sonner';
import {
  CheckCircle,
  XCircle,
  Eye,
  CheckSquare,
  AlertTriangle,
  Building,
  User,
} from 'lucide-react';

export function ModerationQueuePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING_APPROVAL');

  // Reject modal
  const [rejectingProp, setRejectingProp] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
        const data = await adminApi.getProperties();
        setProperties(data);
      } catch (err) {
        console.error('Error loading moderation queue', err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const handleApprove = async (propId) => {
    try {
      await adminApi.moderateProperty(propId, 'APPROVE');
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propId
            ? { ...p, status: 'PUBLISHED', isVerified: true, rejectionReason: null }
            : p
        )
      );
      toast.success('Property approved and published to public marketplace!');
    } catch {
      toast.error('Failed to approve property.');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingProp) return;
    setIsProcessing(true);
    try {
      await adminApi.moderateProperty(rejectingProp.id, 'REJECT', rejectionReason);
      setProperties((prev) =>
        prev.map((p) =>
          p.id === rejectingProp.id
            ? { ...p, status: 'REJECTED', rejectionReason }
            : p
        )
      );
      toast.info('Property rejected with feedback delivered to seller.');
      setRejectingProp(null);
      setRejectionReason('');
    } catch {
      toast.error('Failed to reject property.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading moderation queue..." />;
  }

  const filteredProperties = properties.filter((p) => {
    if (statusFilter === 'ALL') return true;
    return p.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Property Moderation Queue
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Review listings submitted by owners and dealers before they are published to buyers.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          {['PENDING_APPROVAL', 'PUBLISHED', 'REJECTED', 'ALL'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status === 'PENDING_APPROVAL'
                ? 'Pending Review'
                : status === 'PUBLISHED'
                ? 'Approved'
                : status === 'REJECTED'
                ? 'Rejected'
                : 'All'}
            </button>
          ))}
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No properties in this view"
          description="There are currently no listings matching the selected moderation status."
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Property</th>
                  <th className="py-3.5 px-4">Seller Details</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProperties.map((prop) => {
                  const seller = prop.listedBy || {};
                  return (
                    <tr key={prop.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Property Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100'}
                            alt={prop.title}
                            className="h-12 w-16 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <span className="font-bold text-slate-900 truncate block">
                              {prop.title}
                            </span>
                            <span className="text-[11px] text-slate-500 truncate block">
                              {prop.locality}, {prop.city} • {prop.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Seller */}
                      <td className="py-3 px-4">
                        <div>
                          <span className="font-bold text-slate-900 block truncate">
                            {seller.name || 'Seller'}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-500">
                            {seller.role} {seller.agencyName ? `• ${seller.agencyName}` : ''}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {formatCurrencyINR(prop.price, prop.type === 'RENT')}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <StatusBadge status={prop.status} />
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500">{formatDate(prop.createdAt)}</td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/properties/${prop.slug || prop.id}`}>
                            <Button variant="ghost" size="xs" title="Preview Listing">
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          </Link>

                          {prop.status === 'PENDING_APPROVAL' && (
                            <>
                              <Button
                                variant="outline"
                                size="xs"
                                className="text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                                onClick={() => handleApprove(prop.id)}
                                leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                              >
                                Approve
                              </Button>

                              <Button
                                variant="outline"
                                size="xs"
                                className="text-rose-700 border-rose-300 hover:bg-rose-50"
                                onClick={() => {
                                  setRejectingProp(prop);
                                  setRejectionReason('Does not meet photo quality and RERA criteria.');
                                }}
                                leftIcon={<XCircle className="w-3.5 h-3.5" />}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REJECT WITH REASON MODAL */}
      {rejectingProp && (
        <Modal
          isOpen={Boolean(rejectingProp)}
          onClose={() => setRejectingProp(null)}
          title="Reject Property Listing"
          description={`Provide a reason for rejecting "${rejectingProp.title}".`}
          size="md"
        >
          <div className="space-y-4">
            <Textarea
              label="Rejection Reason & Seller Feedback"
              required
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Please upload clear daylight images and enter the correct carpet area."
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectingProp(null)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmReject}
                isLoading={isProcessing}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
