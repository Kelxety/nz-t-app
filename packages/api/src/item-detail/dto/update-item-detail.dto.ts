import { PartialType } from '@nestjs/swagger';
import { CreateItemDetailDto } from './create-item-detail.dto';

export class UpdateItemDetailDto extends PartialType(CreateItemDetailDto) {}
