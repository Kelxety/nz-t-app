import { ApiProperty } from "@nestjs/swagger";
import { ScmLedgerCode } from "@prisma/client";

export class StockLedgerCodeEntity implements ScmLedgerCode {
    constructor(partial: Partial<StockLedgerCodeEntity>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    ledgerCode: string;

    @ApiProperty()
    ledgerName: string;

    @ApiProperty()
    ledgerDesc: string;

    @ApiProperty()
    ledgerFlag: string;

    @ApiProperty()
    state: string;

    @ApiProperty()
    remarks: string;

    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
}
