import { ApiProperty } from "@nestjs/swagger";
import { ScmItemLocationDtl } from "@prisma/client";
import { ItemDetailEntity } from "../../item-detail/entities/item-detail.entity";
import { ItemLocationEntity } from "../../item-location/entities/item-location.entity";

export class ItemLocationDetailEntity implements ScmItemLocationDtl {
    @ApiProperty()
    id: string;

    @ApiProperty()
    itemdtlId: string;

    @ApiProperty()
    locationId: string;

    @ApiProperty()
    qty: number;

    @ApiProperty({ required: false, type: ItemDetailEntity })
    itemDtls: ItemDetailEntity;

    @ApiProperty({ required: false, type: ItemLocationEntity })
    locations: ItemLocationEntity;

    @ApiProperty()
    balanceQty: number;

    constructor({ itemDtls, locations, ...data }: Partial<ItemLocationDetailEntity>) {
        Object.assign(this, data);

        if (itemDtls) {
            this.itemDtls = new ItemDetailEntity(itemDtls);
        }

        if (locations) {
            this.locations = new ItemLocationEntity(locations);
        }
    }


}
