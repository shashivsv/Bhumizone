/**
 * Format amount into Indian currency conventions (Cr, L, K)
 * Example:
 * 15000000 -> ₹ 1.50 Cr
 * 7500000  -> ₹ 75.00 L
 * 45000    -> ₹ 45,000
 */
export function formatCurrencyINR(amount, isRental = false) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Price on Request';
  }

  const num = Number(amount);

  let formatted = '';

  if (num >= 10000000) {
    const cr = num / 10000000;
    formatted = `₹ ${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
  } else if (num >= 100000) {
    const lk = num / 100000;
    formatted = `₹ ${lk % 1 === 0 ? lk : lk.toFixed(2)} L`;
  } else {
    formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  }

  return isRental ? `${formatted} / mo` : formatted;
}

/**
 * Format rate per square foot
 * Example: 8500 -> ₹ 8,500 / sq.ft
 */
export function formatPerSqFt(rate) {
  if (!rate) return '';
  return `₹ ${Number(rate).toLocaleString('en-IN')} / sq.ft`;
}
