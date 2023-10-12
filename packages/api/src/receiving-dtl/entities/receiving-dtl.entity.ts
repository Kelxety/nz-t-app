import { ApiProperty } from "@nestjs/swagger";
import { ScmReceiveDtl } from "@prisma/client";
import { Exclude } from "class-transformer";
import { ItemLocationDetailEntity } from "../../item-location-detail/entities/item-location-detail.entity";
import { ReceivingEntity } from "../../receiving/entities/receiving.entity";

export class ReceivingDtlEntity implements ScmReceiveDtl {

    @ApiProperty()
    id: string;

    @ApiProperty()
    @Exclude()
    receiveId: string;

    @ApiProperty()
    @Exclude()
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

    @ApiProperty()
    itemlocationdtlId: string;

    @ApiProperty({ required: false, type: ReceivingEntity })
    received?: ReceivingEntity;

    @ApiProperty({ required: false, type: ItemLocationDetailEntity })
    itemlocationDtlIds: ItemLocationDetailEntity;

    constructor({ received, itemlocationDtlIds, ...data }: Partial<ReceivingDtlEntity>) {
        Object.assign(this, data);

        if (received) {
            this.received = new ReceivingEntity(received);
        }

        if (itemlocationDtlIds) {
            this.itemlocationDtlIds = new ItemLocationDetailEntity(itemlocationDtlIds);
        }
    }



}
