import React from 'react';

const VARIANTS = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  sky: 'bg-sky-50 text-sky-700 border-sky-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  dark: 'bg-slate-900 text-white border-slate-800',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'emerald',
  size = 'md',
  dot = false,
  className = '',
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.emerald;
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border tracking-wide uppercase ${variantClass} ${sizeClass} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'emerald'
              ? 'bg-emerald-500 animate-pulse'
              : variant === 'amber'
              ? 'bg-amber-500'
              : variant === 'rose'
              ? 'bg-rose-500'
              : 'bg-current'
          }`}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
