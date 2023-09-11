import { PartialType } from '@nestjs/mapped-types';
import { CreateChargeSlipDetailDto } from './create-charge-slip-detail.dto';

export class UpdateChargeSlipDetailDto extends PartialType(CreateChargeSlipDetailDto) {}
