import { PartialType } from '@nestjs/mapped-types';
import { CreateIssuanceDto } from './create-issuance.dto';

export class UpdateIssuanceDto extends PartialType(CreateIssuanceDto) {}
