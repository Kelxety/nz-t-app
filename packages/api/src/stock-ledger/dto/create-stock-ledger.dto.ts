import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStockLedgerDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  fyCode: number;

  @Transform(({ value }) => value && new Date(value))
  @ApiProperty()
  @IsDate()
  entryDate: Date;

  @ApiProperty()
  @IsString()
  warehouseId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  refno: string;

  @Transform(({ value }) => value && new Date(value))
  @ApiProperty()
  @IsDate()
  refdate: Date;

  @ApiProperty()
  @IsNumber()
  qty: number;

  @ApiProperty()
  @IsNumber()
  cost: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  postedBy: string;

  @Transform(({ value }) => value && new Date(value))
  @ApiProperty()
  @IsOptional()
  postedAt: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  remarks: string;
}
