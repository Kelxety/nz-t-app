import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateItemCategoryDto {
  @IsOptional()
  @ApiProperty()
  parentId: string;

  @IsString()
  @ApiProperty()
  catName: string;

  @IsString()
  @ApiProperty()
  catAcro: string;

  @IsNumber()
  @ApiProperty()
  sortOrder: number;

  @IsString()
  @ApiProperty()
  state: string;

  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
