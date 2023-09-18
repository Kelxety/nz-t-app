import { PartialType } from '@nestjs/mapped-types';
import { CreateReceivingDtlDto } from './create-receiving-dtl.dto';

export class UpdateReceivingDtlDto extends PartialType(CreateReceivingDtlDto) {}
