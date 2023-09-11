import { ApiProperty } from '@nestjs/swagger';
import { HospitalPhysician } from '@prisma/client';

export class HospitalPhysicianEntity implements HospitalPhysician {
  @ApiProperty()
  id: string;

  @ApiProperty()
  physicianName: string;

  @ApiProperty()
  designation: string;

  @ApiProperty()
  specialty: string;

  @ApiProperty()
  prcNo: string;

  @ApiProperty()
  prcValidity: Date;

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
