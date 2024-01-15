import { ApiProperty } from '@nestjs/swagger';
import { ScmStockLedger } from '@prisma/client';
import { WarehouseEntity } from '../../warehouse/entities/warehouse.entity';

export class StockLedgerEntity implements ScmStockLedger {
  constructor({ warehouseIds, ...data }: Partial<StockLedgerEntity>) {
    Object.assign(this, data);

    if (warehouseIds) {
      this.warehouseIds = new WarehouseEntity(warehouseIds);
    }
  }

  @ApiProperty()
  remarks: string;

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
  transactionId: string;

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
  warehouseIds?: WarehouseEntity;
}
