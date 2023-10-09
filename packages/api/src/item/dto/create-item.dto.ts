import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  itemCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  barcode: string;

  @ApiProperty({ uniqueItems: true })
  @IsString()
  itemName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  itemImage: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  itemDescription: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  itemcategoryId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  unitId: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  remarks: string;

  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;

  // @ApiProperty()
  // @IsOptional()
  // itemDtls: ItemDetailEntity[]
}
