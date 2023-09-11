import { ApiProperty } from '@nestjs/swagger';
import { HospitalPatientType } from '@prisma/client';

export class HospitalPatientTypeEntity implements HospitalPatientType {
  constructor(partial: Partial<HospitalPatientTypeEntity>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  id: string;

  @ApiProperty()
  patientTypename: string;

  @ApiProperty()
  isPatientselect: boolean;

  @ApiProperty()
  state: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedBy: string;

  @ApiProperty()
  updatedAt: Date;
}
