import { Module } from '@nestjs/common';
import { IssuanceService } from './issuance.service';
import { IssuanceController } from './issuance.controller';

@Module({
  controllers: [IssuanceController],
  providers: [IssuanceService],
})
export class IssuanceModule {}
