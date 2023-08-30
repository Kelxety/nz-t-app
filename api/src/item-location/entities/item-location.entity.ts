import { ApiProperty } from "@nestjs/swagger";
import { ScmItemLocation } from "@prisma/client";
import { WarehouseEntity } from "../../warehouse/entities/warehouse.entity";

export class ItemLocation implements ScmItemLocation {
    @ApiProperty()
    id: string;

    @ApiProperty()
    warehouseId: string;

    @ApiProperty()
    locName: string;

    @ApiProperty()
    state: string;

    @ApiProperty()
    createdBy: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedBy: string;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ required: false, type: WarehouseEntity })
    warehouse: WarehouseEntity;

    constructor({ warehouse, ...data }: Partial<ItemLocation>) {
        Object.assign(this, data);

        if (warehouse) {
            this.warehouse = new WarehouseEntity(warehouse);
        }
    }

}
