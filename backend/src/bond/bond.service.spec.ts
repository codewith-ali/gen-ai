import { BondService } from './bond.service';
import { BadRequestException } from '@nestjs/common';

describe('BondService', () => {
  let service: BondService;

  beforeEach(() => {
    service = new BondService();
  });

  it('returns correct result for sample input', () => {
    const result = service.calculate({
      faceValue: 1000,
      annualCouponRate: 8,
      marketPrice: 950,
      yearsToMaturity: 5,
      couponFrequency: 'semi-annual',
    });
    expect(result.currentYield).toBeCloseTo(80 / 950, 10);
    expect(result.totalInterest).toBe(400);
    expect(result.ytmAnnual).toBeCloseTo(0.09272261, 4);
    expect(result.premiumDiscount).toBe('discount');
    expect(result.schedule).toHaveLength(10);
  });

  it('throws when yearsToMaturity * freq is not integer', () => {
    expect(() =>
      service.calculate({
        faceValue: 1000,
        annualCouponRate: 8,
        marketPrice: 950,
        yearsToMaturity: 2.5,
        couponFrequency: 'annual',
      }),
    ).toThrow(BadRequestException);
  });
});
