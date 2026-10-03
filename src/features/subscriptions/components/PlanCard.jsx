import React from 'react';
import { Button } from '../../../components/ui/Button';
import { formatCurrencyINR } from '../../../utils/currencyFormatter';
import { Check, Sparkles, ShieldCheck } from 'lucide-react';

export function PlanCard({
  plan,
  isCurrentPlan = false,
  onSelect,
  isProcessing = false,
}) {
  const isPopular = plan.isPopular;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl border bg-white p-6 sm:p-8 transition-all duration-300 ${
        isPopular
          ? 'border-emerald-600 shadow-xl shadow-emerald-600/10 ring-2 ring-emerald-600/20'
          : 'border-slate-200/90 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> Most Popular Tier
          </span>
        </div>
      )}

      <div>
        {/* Plan Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
            <p className="mt-1 text-xs text-slate-500">{plan.tagline}</p>
          </div>
          <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            {plan.durationLabel}
          </span>
        </div>

        {/* Pricing */}
        <div className="mt-6 border-b border-slate-100 pb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrencyINR(plan.price)}
            </span>
            {plan.originalPrice && (
              <span className="text-sm font-semibold text-slate-400 line-through">
                {formatCurrencyINR(plan.originalPrice)}
              </span>
            )}
          </div>

          {plan.savingsPercent && (
            <span className="mt-2 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
              Save {plan.savingsPercent}% compared to monthly billing
            </span>
          )}
        </div>

        {/* Feature List */}
        <div className="mt-6 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Included Privileges:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                  <Check className="h-3 w-3" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        {isCurrentPlan ? (
          <Button variant="outline" className="w-full text-emerald-700 border-emerald-300 bg-emerald-50" disabled>
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            Active Subscription
          </Button>
        ) : (
          <Button
            variant={isPopular ? 'primary' : 'secondary'}
            className="w-full"
            size="md"
            onClick={() => onSelect(plan)}
            isLoading={isProcessing}
          >
            Choose {plan.durationLabel} Plan
          </Button>
        )}
      </div>
    </div>
  );
}
