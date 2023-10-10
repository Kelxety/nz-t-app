import { ApiProperty } from "@nestjs/swagger";
import { ScmItemLocationDtl } from "@prisma/client";
import { ItemLocation } from "../../item-location/entities/item-location.entity";
import { ItemEntity } from "../../item/entities/item.entity";

export class ItemLocationDetailEntity implements ScmItemLocationDtl {
    @ApiProperty()
    id: string;

    @ApiProperty()
    itemDtlId: string;

    @ApiProperty()
    locationId: string;

    @ApiProperty({ required: false, type: ItemEntity })
    itemDtls: ItemEntity;

    @ApiProperty({ required: false, type: ItemLocation })
    locations: ItemLocation;

    @ApiProperty()
    balanceQty: string;

    constructor({ itemDtls, locations, ...data }: Partial<ItemLocationDetailEntity>) {
        Object.assign(this, data);

        if (itemDtls) {
            this.itemDtls = new ItemEntity(itemDtls);
        }

        if (locations) {
            this.locations = new ItemLocation(locations);
        }
    }





}
