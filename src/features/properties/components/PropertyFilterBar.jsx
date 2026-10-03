import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import {
  TRANSACTION_TYPES,
  PROPERTY_CATEGORIES,
  BHK_OPTIONS,
  POPULAR_CITIES,
} from '../../../config/propertyConstants';

export function PropertyFilterBar({ filters, onChange, onReset }) {
  const handleTypeChange = (type) => {
    onChange({ ...filters, type });
  };

  const handleCityChange = (city) => {
    onChange({ ...filters, city });
  };

  const handleCategoryChange = (category) => {
    onChange({ ...filters, category });
  };

  const handleBhkToggle = (bhk) => {
    const current = filters.bhk || [];
    const exists = current.includes(bhk);
    const updated = exists
      ? current.filter((item) => item !== bhk)
      : [...current, bhk];
    onChange({ ...filters, bhk: updated });
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm">
      {/* Top Row: Search Input & Transaction Type Switch */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Buy / Rent Switch */}
        <div className="flex rounded-xl bg-slate-100 p-1 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => handleTypeChange('ALL')}
            className={`flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filters.type === 'ALL' || !filters.type
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('BUY')}
            className={`flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filters.type === 'BUY'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('RENT')}
            className={`flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filters.type === 'RENT'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rent
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search by locality, project name, or landmark (e.g. Worli, Whitefield, DLF)..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>

        {/* City Dropdown */}
        <div className="relative w-full md:w-48 shrink-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <MapPin className="h-4 w-4" />
          </div>
          <select
            value={filters.city || 'ALL'}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-8 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 cursor-pointer"
          >
            <option value="ALL">All Cities</option>
            {POPULAR_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="shrink-0 text-slate-500 hover:text-slate-800"
          title="Reset all filters"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Bottom Filter Controls */}
      <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Category Pill Switcher */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mr-1">
            Category:
          </span>
          <button
            type="button"
            onClick={() => handleCategoryChange('ALL')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              filters.category === 'ALL' || !filters.category
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {PROPERTY_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => handleCategoryChange(cat.value)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                filters.category === cat.value
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* BHK Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mr-1">
            BHK:
          </span>
          {BHK_OPTIONS.map((bhk) => {
            const isSelected = filters.bhk?.includes(bhk);
            return (
              <button
                key={bhk}
                type="button"
                onClick={() => handleBhkToggle(bhk)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {bhk}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
