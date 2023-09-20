import { PartialType } from '@nestjs/swagger';
import { CreateReceivingDtlDto } from './create-receiving-dtl.dto';

export class UpdateReceivingDtlDto extends PartialType(CreateReceivingDtlDto) { }
