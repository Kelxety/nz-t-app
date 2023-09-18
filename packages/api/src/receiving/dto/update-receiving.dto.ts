import { PartialType } from '@nestjs/mapped-types';
import { CreateReceivingDto } from './create-receiving.dto';

export class UpdateReceivingDto extends PartialType(CreateReceivingDto) {}
