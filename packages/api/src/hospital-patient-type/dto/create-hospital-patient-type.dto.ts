import { HospitalPatientEntity } from '@api/hospital-patient/entities/hospital-patient.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHospitalPatientTypeDto {
  constructor(partial: Partial<HospitalPatientEntity>) {
    Object.assign(this, partial);
  }
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  patientTypename: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  isPatientselect: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  state: string;

  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
