import { PartialType } from '@nestjs/mapped-types';
import { CreateReceiveModeDto } from './create-receive-mode.dto';

export class UpdateReceiveModeDto extends PartialType(CreateReceiveModeDto) {}
