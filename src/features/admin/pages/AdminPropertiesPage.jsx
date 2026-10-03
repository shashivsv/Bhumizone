import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../../services/api/propertyApi';
import { StatusBadge } from '../../../components/feedback/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { formatCurrencyINR } from '../../../utils/currencyFormatter';
import { formatDate } from '../../../utils/dateFormatter';
import { PageLoader } from '../../../components/feedback/PageLoader';
import { Eye, Building2, Search } from 'lucide-react';

export function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
        const data = await adminApi.getProperties();
        setProperties(data);
      } catch (err) {
        console.error('Error loading properties', err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  if (loading) {
    return <PageLoader message="Loading master property database..." />;
  }

  const filtered = properties.filter((p) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.locality.toLowerCase().includes(q) ||
      p.listedBy?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Master Property Catalog
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            System-wide inventory across all statuses (Published, Pending Approval, Draft, Rejected).
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by title, city, or seller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-3.5 pr-4 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Property</th>
                <th className="py-3.5 px-4">Listed By</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Listed Date</th>
                <th className="py-3.5 px-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100'}
                        alt={prop.title}
                        className="h-10 w-14 rounded-lg object-cover border border-slate-200"
                      />
                      <div className="min-w-0 max-w-xs">
                        <span className="font-bold text-slate-900 block truncate">{prop.title}</span>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {prop.locality}, {prop.city}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{prop.listedBy?.name}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {prop.listedBy?.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatCurrencyINR(prop.price, prop.type === 'RENT')}
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={prop.status} />
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">{formatDate(prop.createdAt)}</td>

                  <td className="py-3.5 px-4 text-right">
                    <Link to={`/properties/${prop.slug || prop.id}`}>
                      <Button variant="ghost" size="xs">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
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
