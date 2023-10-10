import { ApiProperty } from '@nestjs/swagger';
import { ScmItem } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ItemDetailEntity } from '../../item-detail/entities/item-detail.entity';

export class ItemEntity implements ScmItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  itemCode: string;

  @ApiProperty()
  @Exclude()
  barcode: string;

  @ApiProperty()
  @IsEnum(ItemDetailEntity)
  itemName: string;

  @ApiProperty()
  itemDescription: string;

  @ApiProperty()
  itemImage: string;

  @ApiProperty()
  @Exclude()
  itemcategoryId: string;

  @ApiProperty()
  unitId: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  remarks: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedBy: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false, type: ItemDetailEntity })
  itemDtls?: ItemDetailEntity;

  constructor({ itemDtls, ...data }: Partial<ItemEntity>) {
    Object.assign(this, data);

    if (itemDtls) {
      this.itemDtls = new ItemDetailEntity(itemDtls);
    }
  }

}
