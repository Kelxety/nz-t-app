import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHospitalPhysicianDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  physicianName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  designation: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  prcNo: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value && new Date(value))
  prcValidity: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  remarks: string;

  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
