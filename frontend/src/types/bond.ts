export type CouponFrequency = 'annual' | 'semi-annual';

export interface CalculateBondRequest {
  faceValue: number;
  annualCouponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: CouponFrequency;
}

export type PremiumDiscount = 'premium' | 'discount' | 'par';

export interface ScheduleRow {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface BondCalculateResult {
  currentYield: number;
  ytmAnnual: number;
  totalInterest: number;
  premiumDiscount: PremiumDiscount;
  schedule: ScheduleRow[];
}
