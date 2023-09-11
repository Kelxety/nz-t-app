import { ItemDetailEntity } from '@api/item-detail/entities/item-detail.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ScmReturnDtl } from '@prisma/client';

export class ReturnDetailEntity implements ScmReturnDtl {
  constructor(data: Partial<ReturnDetailEntity>) {
    Object.assign(this, data);
  }
  @ApiProperty()
  id: string;

  @ApiProperty()
  returnId: string;

  @ApiProperty()
  itemdtlId: string;

  @ApiProperty()
  qty: number;

  @ApiProperty()
  cost: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  costAmount: number;

  @ApiProperty()
  priceAmount: number;

  @ApiProperty()
  scmItemDtl?: ItemDetailEntity;
}
