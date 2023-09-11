import { PartialType } from '@nestjs/swagger';
import { CreateItemLocationDetailDto } from './create-item-location-detail.dto';

export class UpdateItemLocationDetailDto extends PartialType(
  CreateItemLocationDetailDto,
) {}
