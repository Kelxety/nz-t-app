import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  unitName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  unitAcro: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  state: string;

  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
