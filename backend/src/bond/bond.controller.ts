import { Body, Controller, Post } from '@nestjs/common';
import { BondService, BondCalculateResult } from './bond.service';
import { CalculateBondDto } from './dto/calculate-bond.dto';

@Controller('bond')
export class BondController {
  constructor(private readonly bondService: BondService) {}

  @Post('calculate')
  calculate(@Body() dto: CalculateBondDto): BondCalculateResult {
    return this.bondService.calculate(dto);
  }
}
