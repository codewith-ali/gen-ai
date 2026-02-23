/**
 * Pure bond calculation functions (separately testable).
 * YTM and all outputs use decimals in API (e.g. 0.0927); format as % in UI.
 */

export type PremiumDiscount = 'premium' | 'discount' | 'par';

export interface ScheduleRow {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

const TOLERANCE = 1e-10;
const MAX_ITERATIONS = 200;

export function getFreq(couponFrequency: 'annual' | 'semi-annual'): number {
  return couponFrequency === 'annual' ? 1 : 2;
}

export function computeN(
  yearsToMaturity: number,
  freq: number,
): number | null {
  const n = yearsToMaturity * freq;
  return Number.isInteger(n) ? n : null;
}

export function currentYield(
  faceValue: number,
  annualCouponRatePercent: number,
  marketPrice: number,
): number {
  const annualCoupon = faceValue * (annualCouponRatePercent / 100);
  return annualCoupon / marketPrice;
}

export function totalInterest(
  faceValue: number,
  annualCouponRatePercent: number,
  freq: number,
  n: number,
): number {
  const couponPerPeriod =
    (faceValue * (annualCouponRatePercent / 100)) / freq;
  return couponPerPeriod * n;
}

export function premiumDiscount(
  marketPrice: number,
  faceValue: number,
): PremiumDiscount {
  if (marketPrice > faceValue) return 'premium';
  if (marketPrice < faceValue) return 'discount';
  return 'par';
}

/**
 * Present value of bond at periodic rate r:
 * PV = sum_{t=1..N} couponPerPeriod/(1+r)^t + faceValue/(1+r)^N
 */
function pvAtRate(
  couponPerPeriod: number,
  faceValue: number,
  n: number,
  r: number,
): number {
  if (r <= -1) return Infinity;
  let pv = 0;
  for (let t = 1; t <= n; t++) {
    pv += couponPerPeriod / Math.pow(1 + r, t);
  }
  pv += faceValue / Math.pow(1 + r, n);
  return pv;
}

/**
 * Solve for periodic rate r such that pvAtRate(...) = marketPrice.
 * Bisection: r in (rLo, rHi). For bonds, price decreases as r increases.
 */
export function ytmPeriodicBisection(
  marketPrice: number,
  couponPerPeriod: number,
  faceValue: number,
  n: number,
): number {
  let rLo = -0.99;
  let rHi = 10;
  const pvAtLo = pvAtRate(couponPerPeriod, faceValue, n, rLo);
  const pvAtHi = pvAtRate(couponPerPeriod, faceValue, n, rHi);
  if (marketPrice >= pvAtLo) return rLo;
  if (marketPrice <= pvAtHi) return rHi;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const rMid = (rLo + rHi) / 2;
    const pvMid = pvAtRate(couponPerPeriod, faceValue, n, rMid);
    if (Math.abs(pvMid - marketPrice) < TOLERANCE) return rMid;
    if (pvMid > marketPrice) rLo = rMid;
    else rHi = rMid;
  }
  return (rLo + rHi) / 2;
}

export function ytmAnnual(
  marketPrice: number,
  faceValue: number,
  annualCouponRatePercent: number,
  freq: number,
  n: number,
): number {
  const couponPerPeriod =
    (faceValue * (annualCouponRatePercent / 100)) / freq;
  const r = ytmPeriodicBisection(
    marketPrice,
    couponPerPeriod,
    faceValue,
    n,
  );
  return r * freq;
}

/**
 * Build cash flow schedule. First payment date = baseDate + periodMonths.
 * periodMonths = 12 for annual, 6 for semi-annual.
 */
export function buildSchedule(
  faceValue: number,
  annualCouponRatePercent: number,
  freq: number,
  n: number,
  baseDate: Date = new Date(),
): ScheduleRow[] {
  const couponPerPeriod =
    (faceValue * (annualCouponRatePercent / 100)) / freq;
  const periodMonths = 12 / freq;
  const rows: ScheduleRow[] = [];

  for (let period = 1; period <= n; period++) {
    const paymentDate = new Date(baseDate);
    paymentDate.setMonth(paymentDate.getMonth() + period * periodMonths);
    const cumulativeInterest = couponPerPeriod * period;
    const remainingPrincipal = period < n ? faceValue : 0;
    rows.push({
      period,
      paymentDate: paymentDate.toISOString(),
      couponPayment: couponPerPeriod,
      cumulativeInterest,
      remainingPrincipal,
    });
  }
  return rows;
}
