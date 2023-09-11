import { PartialType } from '@nestjs/mapped-types';
import { CreateReturnDetailDto } from './create-return-detail.dto';

export class UpdateReturnDetailDto extends PartialType(CreateReturnDetailDto) {}
