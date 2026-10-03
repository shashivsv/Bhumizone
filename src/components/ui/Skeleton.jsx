import React from 'react';

export function Skeleton({ className = '', variant = 'rectangular' }) {
  const variantClasses = {
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    text: 'rounded h-4 w-full',
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${
        variantClasses[variant] || variantClasses.rectangular
      } ${className}`}
    />
  );
}
