import { ChargeSlipEntity } from '@api/charge-slip/entities/charge-slip.entity';
import { ReturnDetailEntity } from '@api/return-detail/entities/return-detail.entity';
import { WarehouseEntity } from '@api/warehouse/entities/warehouse.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ScmReturn } from '@prisma/client';

export class ReturnEntity implements ScmReturn {
  constructor({ scmReturnDtls, ...data }: Partial<ReturnEntity>) {
    Object.assign(this, data);
    if (scmReturnDtls) {
      this.scmReturnDtls = scmReturnDtls.map(
        (detail) => new ReturnDetailEntity(detail),
      );
    }
  }
  @ApiProperty()
  id: string;

  @ApiProperty()
  fyCode: number;

  @ApiProperty()
  sretDate: Date;

  @ApiProperty()
  sretRefno: string;

  @ApiProperty()
  warehouseId: string;

  @ApiProperty()
  chargeslipId: string;

  @ApiProperty()
  patientName: string;

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
  scmWarehouse: WarehouseEntity;

  // @ApiProperty()
  // scmChargeslip: ChargeSlipEntity;

  @ApiProperty({ type: ReturnDetailEntity, isArray: true })
  scmReturnDtls: ReturnDetailEntity[];

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedBy: string;

  @ApiProperty()
  updatedAt: Date;
}
