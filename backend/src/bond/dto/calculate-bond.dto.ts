import { IsNumber, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

export type CouponFrequency = 'annual' | 'semi-annual';

export class CalculateBondDto {
  @IsNumber()
  @Min(0.0001, { message: 'faceValue must be greater than 0' })
  @Type(() => Number)
  faceValue: number;

  @IsNumber()
  @Min(0, { message: 'annualCouponRate must be >= 0' })
  @Type(() => Number)
  annualCouponRate: number;

  @IsNumber()
  @Min(0.0001, { message: 'marketPrice must be greater than 0' })
  @Type(() => Number)
  marketPrice: number;

  @IsNumber()
  @Min(0.0001, { message: 'yearsToMaturity must be greater than 0' })
  @Type(() => Number)
  yearsToMaturity: number;

  @IsIn(['annual', 'semi-annual'], {
    message: 'couponFrequency must be "annual" or "semi-annual"',
  })
  couponFrequency: CouponFrequency;
}
