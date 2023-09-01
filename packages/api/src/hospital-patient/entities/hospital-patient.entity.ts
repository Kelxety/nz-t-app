import { ApiProperty } from '@nestjs/swagger';
import { HospitalPatient } from '@prisma/client';

export class HospitalPatientEntity implements HospitalPatient {
  constructor(partial: Partial<HospitalPatientEntity>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  id: string;

  @ApiProperty()
  fyCode: number;

  @ApiProperty()
  patientName: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  middleName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  extName: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  civilStatus: string;

  @ApiProperty()
  nationality: string;

  @ApiProperty()
  contactNo: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  birthdate: Date;

  @ApiProperty()
  state: string;

  @ApiProperty()
  remarks: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedBy: string;

  @ApiProperty()
  updatedAt: Date;
}
