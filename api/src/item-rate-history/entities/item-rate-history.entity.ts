import { ApiProperty } from "@nestjs/swagger";
import { ScmItemRateHistory } from "@prisma/client";
import { ItemDetailEntity } from "../../item-detail/entities/item-detail.entity";

export class ItemRateHistoryEntity implements ScmItemRateHistory {
    constructor({ itemDtl, ...data }: Partial<ItemRateHistoryEntity>) {
        Object.assign(this, data);

        if (itemDtl) {
            this.itemDtl = new ItemDetailEntity(itemDtl);
        }
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    itemdtlId: string;

    @ApiProperty()
    lastCost: number;

    @ApiProperty()
    lastPrice: number;

    @ApiProperty()
    lastMarkup: number;

    @ApiProperty()
    cost: number;

    @ApiProperty()
    price: number;

    @ApiProperty()
    markup: number;

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

    @ApiProperty({ required: false, type: ItemDetailEntity })
    itemDtl: ItemDetailEntity;
}
