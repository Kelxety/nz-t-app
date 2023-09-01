import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  whName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  whAcro: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  state: string;

  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
