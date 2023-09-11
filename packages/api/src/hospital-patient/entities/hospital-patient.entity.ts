import { ChargeSlipEntity } from '@api/charge-slip/entities/charge-slip.entity';
import { ApiProperty } from '@nestjs/swagger';
import { HospitalPatient } from '@prisma/client';

export class HospitalPatientEntity implements HospitalPatient {
  constructor({ scmChargeslips, ...partial }: Partial<HospitalPatientEntity>) {
    Object.assign(this, partial);
    if (scmChargeslips) {
      this.scmChargeslips = scmChargeslips.map((i) => new ChargeSlipEntity(i));
    }
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

  @ApiProperty({ type: ChargeSlipEntity, isArray: true })
  scmChargeslips: ChargeSlipEntity[];

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
