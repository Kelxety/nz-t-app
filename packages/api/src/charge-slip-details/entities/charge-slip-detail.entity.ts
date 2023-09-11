import { ChargeSlipEntity } from '@api/charge-slip/entities/charge-slip.entity';
import { ItemDetailEntity } from '@api/item-detail/entities/item-detail.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ScmChargeslipDtl } from '@prisma/client';

export class ChargeSlipDetailEntity implements ScmChargeslipDtl {
  constructor({ scmChargeslip, ...partial }: Partial<ChargeSlipDetailEntity>) {
    Object.assign(this, partial);
    if (scmChargeslip) {
      this.scmChargeslip = new ChargeSlipEntity(scmChargeslip);
    }
  }
  @ApiProperty()
  id: string;

  @ApiProperty()
  chargeslipId: string;

  @ApiProperty()
  itemdtlId: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  qty: number;

  @ApiProperty()
  priceAmount: number;

  @ApiProperty()
  patienttypeId: string;

  @ApiProperty({ type: () => ChargeSlipEntity })
  scmChargeslip: ChargeSlipEntity;

  @ApiProperty()
  scmItemDtl: ItemDetailEntity;
}
