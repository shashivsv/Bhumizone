import React from 'react';
import { PROPERTY_STATUS, PROPERTY_STATUS_CONFIG } from '../../config/propertyConstants';
import { Badge } from '../ui/Badge';

export function StatusBadge({ status, className = '' }) {
  const config = PROPERTY_STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    color: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  let variant = 'slate';
  if (status === PROPERTY_STATUS.PUBLISHED) variant = 'emerald';
  if (status === PROPERTY_STATUS.PENDING_APPROVAL) variant = 'amber';
  if (status === PROPERTY_STATUS.REJECTED) variant = 'rose';
  if (status === PROPERTY_STATUS.APPROVED) variant = 'sky';

  return (
    <Badge variant={variant} dot className={className}>
      {config.label}
    </Badge>
  );
}

export function SubscriptionBadge({ isActive, isExpired, className = '' }) {
  if (isActive) {
    return (
      <Badge variant="emerald" dot className={className}>
        Subscription Active
      </Badge>
    );
  }
  if (isExpired) {
    return (
      <Badge variant="rose" className={className}>
        Subscription Expired
      </Badge>
    );
  }
  return (
    <Badge variant="slate" className={className}>
      Free / No Plan
    </Badge>
  );
}
