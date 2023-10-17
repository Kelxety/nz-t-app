import { ApiProperty } from "@nestjs/swagger";
import { ScmItemDtl } from "@prisma/client";
import { Exclude } from "class-transformer";
import { ItemEntity } from "../../item/entities/item.entity";
import { ReceiveMode } from "../../receive-mode/entities/receive-mode.entity";
import { UnitEntity } from "../../unit/entities/unit.entity";

export class ItemDetailEntity implements ScmItemDtl {

    @ApiProperty()
    rrModeId: string;

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

    @ApiProperty({ required: false, type: ReceiveMode })
    rrMode: ReceiveMode;

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

    @ApiProperty({ required: false, type: ItemEntity })
    itemIds?: ItemEntity;

    constructor({ unitIds, itemIds, rrMode, ...data }: Partial<ItemDetailEntity>) {
        Object.assign(this, data);

        if (unitIds) {
            this.unitIds = new UnitEntity(unitIds);
        }

        if (rrMode) {
            this.rrMode = new ReceiveMode(rrMode);
        }

        if (itemIds) {
            this.itemIds = new ItemEntity(itemIds);
        }
    }

}
