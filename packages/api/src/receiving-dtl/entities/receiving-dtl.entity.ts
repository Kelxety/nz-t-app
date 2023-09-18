import { ApiProperty } from "@nestjs/swagger";
import { ScmReceiveDtl } from "@prisma/client";

export class ReceivingDtl implements ScmReceiveDtl {
    @ApiProperty()
    id: string;

    @ApiProperty()
    receiveId: string;

    @ApiProperty()
    itemdtlId: string;

    @ApiProperty()
    qty: number;

    @ApiProperty()
    cost: number;

    @ApiProperty()
    costAmount: number;

    @ApiProperty()
    lotNo: string;

    @ApiProperty()
    batchNo: string;

    @ApiProperty()
    expirationDate: Date;

    @ApiProperty()
    barcodeNo: string;
}
