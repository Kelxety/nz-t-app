import { ApiProperty } from '@nestjs/swagger';
import { ScmItem } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ItemCategoryEntity } from '../../item-category/entities/item-category.entity';

export class ItemEntity implements ScmItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  itemCode: string;

  @ApiProperty()
  @Exclude()
  barcode: string;

  @ApiProperty()
  itemName: string;

  @ApiProperty()
  itemDescription: string;

  @ApiProperty()
  itemImage: string;

  @ApiProperty()
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

  @ApiProperty({ required: false, type: ItemCategoryEntity })
  itemcategoryIds?: ItemCategoryEntity;

  constructor({ itemcategoryIds, ...data }: Partial<ItemEntity>) {
    Object.assign(this, data);

    if (itemcategoryIds) {
      this.itemcategoryIds = new ItemCategoryEntity(itemcategoryIds);
    }
  }

}
