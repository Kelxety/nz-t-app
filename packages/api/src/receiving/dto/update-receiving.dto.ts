import { PartialType } from '@nestjs/swagger';
import { CreateReceivingDto } from './create-receiving.dto';

export class UpdateReceivingDto extends PartialType(CreateReceivingDto) { }
