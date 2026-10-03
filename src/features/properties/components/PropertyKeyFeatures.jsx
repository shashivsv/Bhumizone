import React from 'react';
import {
  Bed,
  Bath,
  Maximize2,
  Compass,
  Layers,
  Calendar,
  Sparkles,
  Key,
  Shield,
} from 'lucide-react';

export function PropertyKeyFeatures({ property }) {
  const specs = [
    { label: 'Bedrooms', value: property.bhk, icon: Bed },
    { label: 'Bathrooms', value: property.bathrooms ? `${property.bathrooms} Baths` : 'N/A', icon: Bath },
    { label: 'Carpet Area', value: property.carpetArea ? `${property.carpetArea} sq.ft` : 'N/A', icon: Maximize2 },
    { label: 'Super Area', value: property.superBuiltUpArea ? `${property.superBuiltUpArea} sq.ft` : 'N/A', icon: Layers },
    { label: 'Furnishing', value: property.furnishing || 'Unfurnished', icon: Sparkles },
    { label: 'Facing', value: property.facing || 'East', icon: Compass },
    { label: 'Floor Level', value: property.floor !== undefined ? `${property.floor} of ${property.totalFloors || 'N/A'}` : 'N/A', icon: Layers },
    { label: 'Possession', value: property.possessionStatus || 'Ready to Move', icon: Key },
    { label: 'Age of Property', value: property.ageOfProperty || '0-1 Years', icon: Calendar },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
        Property Overview & Specifications
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {specs.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
