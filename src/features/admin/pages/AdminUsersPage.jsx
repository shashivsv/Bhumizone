import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../services/api/propertyApi';
import { Badge } from '../../../components/ui/Badge';
import { ROLE_LABELS, ROLE_BADGE_COLORS } from '../../../config/roles';
import { formatDate } from '../../../utils/dateFormatter';
import { PageLoader } from '../../../components/feedback/PageLoader';
import { Users, Phone, Mail, Building, ShieldCheck, Crown } from 'lucide-react';

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const data = await adminApi.getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Error loading users', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  if (loading) {
    return <PageLoader message="Loading registered platform users..." />;
  }

  const filteredUsers = users.filter((u) => {
    if (roleFilter === 'ALL') return true;
    return u.role === roleFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            User Directory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Inspect all registered buyers, individual owners, and real estate dealer accounts.
          </p>
        </div>

        {/* Role Filters */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          {['ALL', 'DEALER', 'OWNER', 'BUYER', 'ADMIN'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                roleFilter === r
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r === 'ALL' ? 'All Users' : ROLE_LABELS[r] || r}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Properties</th>
                <th className="py-3.5 px-4">Subscription Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map((u) => {
                const isDealer = u.role === 'DEALER';
                const isSubscribed = isDealer && u.subscription?.isActive;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* User Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={u.name}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 truncate">{u.name}</p>
                          {u.agencyName && (
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Building className="w-3 h-3" /> {u.agencyName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          ROLE_BADGE_COLORS[u.role] || 'bg-slate-100'
                        }`}
                      >
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <Phone className="w-3 h-3 text-slate-400" /> {u.phone}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Mail className="w-3 h-3 text-slate-400" /> {u.email}
                        </span>
                      </div>
                    </td>

                    {/* Listings Count */}
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {u.propertiesCount || 0} Listings
                    </td>

                    {/* Subscription */}
                    <td className="py-3 px-4">
                      {isDealer ? (
                        isSubscribed ? (
                          <div className="flex items-center gap-1.5">
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                              Active: {u.subscription.planName || 'Subscribed'}
                            </span>
                          </div>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                            Unsubscribed (Masked)
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-slate-500">{formatDate(u.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
