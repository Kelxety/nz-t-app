import { Module } from '@nestjs/common';
import { ReceivingDtlService } from './receiving-dtl.service';
import { ReceivingDtlController } from './receiving-dtl.controller';

@Module({
  controllers: [ReceivingDtlController],
  providers: [ReceivingDtlService],
})
export class ReceivingDtlModule {}
