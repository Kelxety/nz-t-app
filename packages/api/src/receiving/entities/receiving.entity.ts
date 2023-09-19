import { ApiProperty } from "@nestjs/swagger";
import { ScmReceive } from "@prisma/client";
import { ReceiveMode } from "../../receive-mode/entities/receive-mode.entity";
import { SupplierEntity } from "../../supplier/entities/supplier.entity";
import { WarehouseEntity } from "../../warehouse/entities/warehouse.entity";

export class ReceivingEntity implements ScmReceive {
    @ApiProperty()
    id: string;

    @ApiProperty()
    fyCode: number;

    @ApiProperty()
    rcvDate: Date;

    @ApiProperty()
    rcvRefno: string;

    @ApiProperty()
    warehouseId: string;

    @ApiProperty()
    supplierId: string;

    @ApiProperty()
    receivemodeId: string;

    @ApiProperty()
    purchaserequestNo: string;

    @ApiProperty()
    deliveryreceiptNo: string;

    @ApiProperty()
    purchaseorderNo: string;

    @ApiProperty()
    state: string;

    @ApiProperty()
    remarks: string;

    @ApiProperty()
    isPosted: boolean;

    @ApiProperty()
    postedBy: string;

    @ApiProperty()
    postedAt: Date;

    @ApiProperty()
    createdBy: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedBy: string;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ required: false, type: WarehouseEntity })
    warehouse?: WarehouseEntity;

    @ApiProperty({ required: false, type: ReceiveMode })
    receivemode?: ReceiveMode;

    @ApiProperty({ required: false, type: SupplierEntity })
    supplier?: SupplierEntity;

    constructor({ warehouse, receivemode, supplier, ...data }: Partial<ReceivingEntity>) {
        Object.assign(this, data);

        if (warehouse) {
            this.warehouse = new WarehouseEntity(warehouse);
        }

        if (receivemode) {
            this.receivemode = new ReceiveMode(receivemode);
        }
        if (supplier) {
            this.supplier = new SupplierEntity(supplier);
        }
    }
}
