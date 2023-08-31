import { HospitalPatient } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHospitalPatientDto {
  constructor(partial: Partial<HospitalPatient>) {
    Object.assign(this, partial);
  }
  @IsString()
  @IsNotEmpty()
  fyCode: number;

  @IsString()
  @IsNotEmpty()
  patientName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  middleName: string;
  lastName: string;
  extName: string;
  address: string;
  civilStatus: string;
  nationality: string;
  contactNo: string;
  gender: string;
  birthdate: Date;
  state: string;
  remarks: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
