import React, { useState, useEffect } from 'react';
import { subscriptionApi } from '../../../services/api/propertyApi';
import { formatCurrencyINR } from '../../../utils/currencyFormatter';
import { formatDate } from '../../../utils/dateFormatter';
import { PageLoader } from '../../../components/feedback/PageLoader';
import { CreditCard, CheckCircle2, Building } from 'lucide-react';

export function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      setLoading(true);
      try {
        const data = await subscriptionApi.getTransactions();
        setTransactions(data);
      } catch (err) {
        console.error('Error loading transactions', err);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  if (loading) {
    return <PageLoader message="Loading transaction audit ledger..." />;
  }

  const totalRevenue = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Subscription Payment Ledger
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Real-time audit log of all dealer tier transactions, payment gateway references, and invoices.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-right">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Total Dealer Revenue
          </p>
          <p className="text-xl font-extrabold text-emerald-900">
            {formatCurrencyINR(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Transaction / Ref ID</th>
                <th className="py-3.5 px-4">Dealer Agency</th>
                <th className="py-3.5 px-4">Plan</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {txn.referenceId || txn.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{txn.dealerName}</p>
                    {txn.agencyName && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Building className="w-3 h-3" /> {txn.agencyName}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4">{txn.planName}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatCurrencyINR(txn.amount)}
                  </td>
                  <td className="py-3.5 px-4">{txn.paymentMethod}</td>
                  <td className="py-3.5 px-4 text-slate-500">{formatDate(txn.createdAt)}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
