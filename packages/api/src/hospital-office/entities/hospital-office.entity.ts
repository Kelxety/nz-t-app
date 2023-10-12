import { ApiProperty } from '@nestjs/swagger';
import { HospitalOffice } from '@prisma/client';

export class HospitalOfficeEntity implements HospitalOffice {
  constructor(partial: Partial<HospitalOffice>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  officeName: string;

  @ApiProperty()
  officeAcro: string;

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
