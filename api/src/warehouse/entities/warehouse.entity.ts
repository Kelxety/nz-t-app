import { ApiProperty } from '@nestjs/swagger';
import { ScmWarehouse } from '@prisma/client';

export class WarehouseEntity implements ScmWarehouse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  whName: string;

  @ApiProperty()
  whAcro: string;

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
}
