import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChargeSlipDto {
  @ApiProperty()
  fyCode?: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  csRefno: string;

  @ApiProperty({ required: true })
  @IsDate()
  csDate: Date;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  csName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  patienttypeId: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  physicianId: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  patientId: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  warehouseId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  remarks: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  isPosted: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  postedBy: string;

  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
