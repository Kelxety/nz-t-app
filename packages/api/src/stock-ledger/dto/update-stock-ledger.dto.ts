import { PartialType } from '@nestjs/mapped-types';
import { CreateStockLedgerDto } from './create-stock-ledger.dto';

export class UpdateStockLedgerDto extends PartialType(CreateStockLedgerDto) {}
