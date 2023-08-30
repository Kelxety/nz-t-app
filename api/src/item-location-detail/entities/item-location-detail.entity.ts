import { ApiProperty } from "@nestjs/swagger";
import { ScmItemLocationDtl } from "@prisma/client";
import { ItemLocation } from "../../item-location/entities/item-location.entity";
import { ItemEntity } from "../../item/entities/item.entity";

export class ItemLocationDetailEntity implements ScmItemLocationDtl {
    @ApiProperty()
    id: string;

    @ApiProperty()
    itemId: string;

    @ApiProperty()
    locationId: string;

    @ApiProperty({ required: false, type: ItemEntity })
    items: ItemEntity;

    @ApiProperty({ required: false, type: ItemLocation })
    locations: ItemLocation;

    constructor({ items, locations, ...data }: Partial<ItemLocationDetailEntity>) {
        Object.assign(this, data);

        if (items) {
            this.items = new ItemEntity(items);
        }

        if (locations) {
            this.locations = new ItemLocation(locations);
        }
    }


}
