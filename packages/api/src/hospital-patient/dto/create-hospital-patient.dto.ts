import { ApiProperty } from '@nestjs/swagger';
import { HospitalPatient } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHospitalPatientDto {
  constructor(partial: Partial<HospitalPatient>) {
    Object.assign(this, partial);
  }

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  patientName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  middleName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  extName: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  address: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  civilStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  nationality: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  contactNo: string;

  @ApiProperty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => value && new Date(value))
  birthdate: Date;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  remarks: string;

  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
