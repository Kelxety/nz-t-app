import { ApiProperty } from "@nestjs/swagger";
import { ScmItemDtl } from "@prisma/client";
import { Exclude } from "class-transformer";
import { UnitEntity } from "../../unit/entities/unit.entity";

export class ItemDetailEntity implements ScmItemDtl {
    constructor(
        { unitIds, ...data }: Partial<ItemDetailEntity>) {
        Object.assign(this, data);
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
    @Exclude()
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

    @ApiProperty({ required: false, type: UnitEntity })
    unitIds?: UnitEntity;


}
