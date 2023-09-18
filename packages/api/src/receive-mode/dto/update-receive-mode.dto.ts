import { PartialType } from '@nestjs/swagger';
import { CreateReceiveModeDto } from './create-receive-mode.dto';

export class UpdateReceiveModeDto extends PartialType(CreateReceiveModeDto) { }
