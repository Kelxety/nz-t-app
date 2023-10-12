import { ApiProperty } from "@nestjs/swagger";
import { ScmItemLocationDtl } from "@prisma/client";
import { ItemDetailEntity } from "../../item-detail/entities/item-detail.entity";
import { ItemLocation } from "../../item-location/entities/item-location.entity";

export class ItemLocationDetailEntity implements ScmItemLocationDtl {
    @ApiProperty()
    id: string;

    @ApiProperty()
    itemdtlId: string;

    @ApiProperty()
    locationId: string;

    @ApiProperty({ required: false, type: ItemDetailEntity })
    itemDtls: ItemDetailEntity;

    @ApiProperty({ required: false, type: ItemLocation })
    locations: ItemLocation;

    @ApiProperty()
    balanceQty: number;

    constructor({ itemDtls, locations, ...data }: Partial<ItemLocationDetailEntity>) {
        Object.assign(this, data);

        if (itemDtls) {
            this.itemDtls = new ItemDetailEntity(itemDtls);
        }

        if (locations) {
            this.locations = new ItemLocation(locations);
        }
    }

}
