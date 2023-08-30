import { PartialType } from '@nestjs/swagger';
import { CreateItemRateHistoryDto } from './create-item-rate-history.dto';

export class UpdateItemRateHistoryDto extends PartialType(CreateItemRateHistoryDto) {}
