import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChargeSlipDetailDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  chargeslipId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  itemdtlId: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  priceAmount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  patienttypeId: string;
}
