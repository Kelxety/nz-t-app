import { PartialType } from '@nestjs/swagger';
import { CreateItemLocationDto } from './create-item-location.dto';

export class UpdateItemLocationDto extends PartialType(CreateItemLocationDto) {}
