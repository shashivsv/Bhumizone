import React from 'react';
import {
  Car,
  ShieldCheck,
  ArrowUpDown,
  Dumbbell,
  Waves,
  Zap,
  Building2,
  Trees,
  Droplets,
  Flame,
  BatteryCharging,
  Wifi,
  Check,
} from 'lucide-react';
import { AMENITIES_LIST } from '../../../config/propertyConstants';

const AMENITY_ICONS = {
  parking: Car,
  security: ShieldCheck,
  lift: ArrowUpDown,
  gym: Dumbbell,
  pool: Waves,
  power_backup: Zap,
  clubhouse: Building2,
  garden: Trees,
  water_supply: Droplets,
  gas_pipeline: Flame,
  ev_charging: BatteryCharging,
  wifi: Wifi,
};

export function PropertyAmenities({ amenities = [] }) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
        Amenities & Project Facilities
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {amenities.map((amenityId) => {
          const item = AMENITIES_LIST.find((a) => a.id === amenityId);
          const label = item ? item.label : amenityId;
          const Icon = AMENITY_ICONS[amenityId] || Check;

          return (
            <div
              key={amenityId}
              className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 text-xs font-semibold text-slate-800"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="truncate">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
