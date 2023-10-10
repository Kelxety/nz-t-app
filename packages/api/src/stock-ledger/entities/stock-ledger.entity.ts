import { ApiProperty } from "@nestjs/swagger";
import { ScmStockLedger } from "@prisma/client";
import { ItemLocationDetailEntity } from "../../item-location-detail/entities/item-location-detail.entity";
import { StockLedgerCodeEntity } from "../../stock-ledger-code/entities/stock-ledger-code.entity";
import { WarehouseEntity } from "../../warehouse/entities/warehouse.entity";

export class StockLedgerEntity implements ScmStockLedger {
    constructor({ warehouseIds, itemlocationdtlIds, ledgercodeIds, ...data }: Partial<StockLedgerEntity>) {
        Object.assign(this, data);

        if (warehouseIds) {
            this.warehouseIds = new WarehouseEntity(warehouseIds);
        }

        if (itemlocationdtlIds) {
            this.itemlocationdtlIds = new ItemLocationDetailEntity(itemlocationdtlIds);
        }

        if (ledgercodeIds) {
            this.ledgercodeIds = new StockLedgerCodeEntity(ledgercodeIds);
        }
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    fyCode: number;

    @ApiProperty()
    entryDate: Date;

    @ApiProperty()
    warehouseId: string;

    @ApiProperty()
    itemlocationdtlId: string;

    @ApiProperty()
    itemdtlId: string;

    @ApiProperty()
    ledgercodeId: string;

    @ApiProperty()
    refno: string;

    @ApiProperty()
    refdate: Date;

    @ApiProperty()
    qty: number;

    @ApiProperty()
    cost: number;

    @ApiProperty()
    price: number;

    @ApiProperty()
    postedBy: string;

    @ApiProperty()
    postedAt: Date;

    @ApiProperty({ required: false, type: WarehouseEntity })
    warehouseIds?: WarehouseEntity

    @ApiProperty({ required: false, type: ItemLocationDetailEntity })
    itemlocationdtlIds?: ItemLocationDetailEntity

    @ApiProperty({ required: false, type: StockLedgerCodeEntity })
    ledgercodeIds?: StockLedgerCodeEntity
}
