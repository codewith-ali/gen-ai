import {
  getFreq,
  computeN,
  currentYield,
  totalInterest,
  premiumDiscount,
  ytmAnnual,
  buildSchedule,
} from './bond.math';

describe('bond.math', () => {
  describe('getFreq', () => {
    it('returns 1 for annual', () => {
      expect(getFreq('annual')).toBe(1);
    });
    it('returns 2 for semi-annual', () => {
      expect(getFreq('semi-annual')).toBe(2);
    });
  });

  describe('computeN', () => {
    it('returns integer N for 5 years semi-annual', () => {
      expect(computeN(5, 2)).toBe(10);
    });
    it('returns integer N for 3 years annual', () => {
      expect(computeN(3, 1)).toBe(3);
    });
    it('returns null when N is not integer', () => {
      expect(computeN(2.5, 2)).toBe(5);
      expect(computeN(2.3, 2)).toBeNull();
    });
  });

  describe('currentYield', () => {
    it('sample: faceValue=1000, rate=8%, marketPrice=950 => 80/950', () => {
      const result = currentYield(1000, 8, 950);
      expect(result).toBeCloseTo(80 / 950, 10);
      expect(result).toBeCloseTo(0.08421052631578947, 10);
    });
  });

  describe('totalInterest', () => {
    it('sample: 5 years semi-annual, 8% => 400', () => {
      const result = totalInterest(1000, 8, 2, 10);
      expect(result).toBe(400);
    });
  });

  describe('premiumDiscount', () => {
    it('marketPrice > faceValue => premium', () => {
      expect(premiumDiscount(1050, 1000)).toBe('premium');
    });
    it('marketPrice < faceValue => discount', () => {
      expect(premiumDiscount(950, 1000)).toBe('discount');
    });
    it('marketPrice = faceValue => par', () => {
      expect(premiumDiscount(1000, 1000)).toBe('par');
    });
  });

  describe('ytmAnnual', () => {
    it('sample: faceValue=1000, rate=8%, marketPrice=950, 5y semi-annual ≈ 0.09272261', () => {
      const result = ytmAnnual(950, 1000, 8, 2, 10);
      expect(result).toBeCloseTo(0.09272261, 4);
    });
  });

  describe('buildSchedule', () => {
    it('returns N rows with correct coupon and cumulative interest', () => {
      const base = new Date('2025-01-15T12:00:00.000Z');
      const rows = buildSchedule(1000, 8, 2, 4, base);
      expect(rows).toHaveLength(4);
      expect(rows[0].period).toBe(1);
      expect(rows[0].couponPayment).toBe(40);
      expect(rows[0].cumulativeInterest).toBe(40);
      expect(rows[0].remainingPrincipal).toBe(1000);
      expect(rows[3].period).toBe(4);
      expect(rows[3].remainingPrincipal).toBe(0);
      expect(rows[3].cumulativeInterest).toBe(160);
    });
  });
});
