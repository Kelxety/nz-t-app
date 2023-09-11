import { PartialType } from '@nestjs/mapped-types';
import { CreateChargeSlipDto } from './create-charge-slip.dto';

export class UpdateChargeSlipDto extends PartialType(CreateChargeSlipDto) {}
