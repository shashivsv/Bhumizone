import React, { useState, useEffect } from 'react';
import { subscriptionApi, adminApi } from '../../../services/api/propertyApi';
import { PlanCard } from '../../subscriptions/components/PlanCard';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { formatCurrencyINR } from '../../../utils/currencyFormatter';
import { PageLoader } from '../../../components/feedback/PageLoader';
import { toast } from 'sonner';
import { Crown, Edit3, Sparkles, CheckCircle2 } from 'lucide-react';

export function AdminPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Plan Modal State
  const [editingPlan, setEditingPlan] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editTagline, setEditTagline] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      setLoading(true);
      try {
        const data = await subscriptionApi.getPlans();
        setPlans(data);
      } catch (err) {
        console.error('Error loading plans', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setEditPrice(String(plan.price));
    setEditOriginalPrice(String(plan.originalPrice || ''));
    setEditTagline(plan.tagline || '');
  };

  const handleSavePlan = async () => {
    if (!editingPlan || !editPrice) return;
    setIsSaving(true);

    try {
      const updated = await adminApi.updatePlan(editingPlan.id, {
        price: Number(editPrice),
        originalPrice: editOriginalPrice ? Number(editOriginalPrice) : null,
        tagline: editTagline,
      });

      setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.success(`${updated.name} pricing and configurations updated!`);
      setEditingPlan(null);
    } catch {
      toast.error('Failed to update plan.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading subscription plan configurations..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Dealer Subscription Plan Configurations
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Configure active tier pricing, duration rules, and promotional savings for real estate dealers.
        </p>
      </div>

      {/* Plans Grid with Edit Action */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="relative">
            <PlanCard
              plan={plan}
              onSelect={() => handleOpenEdit(plan)}
            />
            <div className="mt-2 text-center">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold"
                onClick={() => handleOpenEdit(plan)}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit Plan Settings
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT PLAN MODAL */}
      {editingPlan && (
        <Modal
          isOpen={Boolean(editingPlan)}
          onClose={() => setEditingPlan(null)}
          title={`Edit ${editingPlan.name} Settings`}
          description={`Update price and marketing details for this ${editingPlan.durationLabel} tier.`}
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Active Price (in ₹)"
              type="number"
              required
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              helperText={editPrice ? `Formatted: ${formatCurrencyINR(editPrice)}` : ''}
            />

            <Input
              label="Original Strike-Through Price (in ₹)"
              type="number"
              value={editOriginalPrice}
              onChange={(e) => setEditOriginalPrice(e.target.value)}
              placeholder="e.g. 5999"
              helperText="Optional: used to display discount percentage to dealers."
            />

            <Input
              label="Tagline Description"
              value={editTagline}
              onChange={(e) => setEditTagline(e.target.value)}
              placeholder="e.g. Best balance of buyer visibility and cost efficiency."
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingPlan(null)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSavePlan}
                isLoading={isSaving}
              >
                Save Configurations
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
