import { BadRequestException } from '@nestjs/common';
import { CalculateBondDto } from './dto/calculate-bond.dto';
import {
  getFreq,
  computeN,
  currentYield,
  totalInterest,
  premiumDiscount,
  ytmAnnual,
  buildSchedule,
  ScheduleRow,
  PremiumDiscount as PD,
} from './bond.math';

export interface BondCalculateResult {
  currentYield: number;
  ytmAnnual: number;
  totalInterest: number;
  premiumDiscount: PD;
  schedule: ScheduleRow[];
}

export class BondService {
  calculate(dto: CalculateBondDto): BondCalculateResult {
    const freq = getFreq(dto.couponFrequency);
    const n = computeN(dto.yearsToMaturity, freq);
    if (n === null) {
      throw new BadRequestException(
        `yearsToMaturity * coupon frequency must be an integer (got ${dto.yearsToMaturity * freq})`,
      );
    }

    return {
      currentYield: currentYield(
        dto.faceValue,
        dto.annualCouponRate,
        dto.marketPrice,
      ),
      ytmAnnual: ytmAnnual(
        dto.marketPrice,
        dto.faceValue,
        dto.annualCouponRate,
        freq,
        n,
      ),
      totalInterest: totalInterest(
        dto.faceValue,
        dto.annualCouponRate,
        freq,
        n,
      ),
      premiumDiscount: premiumDiscount(dto.marketPrice, dto.faceValue),
      schedule: buildSchedule(
        dto.faceValue,
        dto.annualCouponRate,
        freq,
        n,
      ),
    };
  }
}
