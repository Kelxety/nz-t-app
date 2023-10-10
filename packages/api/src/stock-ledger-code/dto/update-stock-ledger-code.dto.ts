import { PartialType } from '@nestjs/mapped-types';
import { CreateStockLedgerCodeDto } from './create-stock-ledger-code.dto';

export class UpdateStockLedgerCodeDto extends PartialType(CreateStockLedgerCodeDto) {}
