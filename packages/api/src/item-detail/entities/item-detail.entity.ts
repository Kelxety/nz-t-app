import { ApiProperty } from "@nestjs/swagger";
import { ScmItemDtl } from "@prisma/client";

export class ItemDetailEntity implements ScmItemDtl {
    constructor(partial: Partial<ItemDetailEntity>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    fyCode: number;

    @ApiProperty()
    entryDate: Date;

    @ApiProperty()
    itemId: string;

    @ApiProperty()
    parentId: string;

    @ApiProperty({ uniqueItems: true })
    subitemCode: string;

    @ApiProperty()
    subitemName: string;

    @ApiProperty()
    barcode: string;

    @ApiProperty()
    unitId: string;

    @ApiProperty()
    brandName: string;

    @ApiProperty()
    lotNo: string;

    @ApiProperty()
    batchNo: string;

    @ApiProperty()
    expirationDate: Date;

    @ApiProperty({ default: 0 })
    cost: number;

    @ApiProperty({ default: 0 })
    price: number;

    @ApiProperty({ default: 0 })
    markup: number;

    @ApiProperty()
    balanceQty: number;

    @ApiProperty()
    rrMode: string;

    @ApiProperty()
    state: string;

    @ApiProperty()
    remarks: string;

    @ApiProperty()
    createdBy: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedBy: string;

    @ApiProperty()
    updatedAt: Date;
}
