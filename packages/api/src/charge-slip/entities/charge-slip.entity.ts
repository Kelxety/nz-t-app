import { ChargeSlipDetailEntity } from '@api/charge-slip-details/entities/charge-slip-detail.entity';
import { HospitalPatientTypeEntity } from '@api/hospital-patient-type/entities/hospital-patient-type.entity';
import { HospitalPatientEntity } from '@api/hospital-patient/entities/hospital-patient.entity';
import { HospitalPhysicianEntity } from '@api/hospital-physician/entities/hospital-physician.entity';
import { ReturnEntity } from '@api/returns/entities/return.entity';
import { WarehouseEntity } from '@api/warehouse/entities/warehouse.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ScmChargeslip } from '@prisma/client';

export class ChargeSlipEntity implements ScmChargeslip {
  constructor({ scmChargeslipDtls, ...data }: Partial<ChargeSlipEntity>) {
    Object.assign(this, data);
    if (scmChargeslipDtls) {
      this.scmChargeslipDtls = scmChargeslipDtls.map(
        (detail) => new ChargeSlipDetailEntity(detail),
      );
    }
  }
  @ApiProperty()
  id: string;

  @ApiProperty()
  fyCode: number;

  @ApiProperty()
  csRefno: string;

  @ApiProperty()
  csDate: Date;

  @ApiProperty()
  csName: string;

  @ApiProperty()
  patienttypeId: string;

  @ApiProperty()
  physicianId: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  warehouseId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  state: string;

  @ApiProperty()
  remarks: string;

  @ApiProperty()
  isPosted: boolean;

  @ApiProperty()
  postedBy: string;

  @ApiProperty()
  hospitalPatientType: HospitalPatientTypeEntity;

  @ApiProperty({ type: () => HospitalPatientEntity })
  hospitalPatient: HospitalPatientEntity;

  @ApiProperty()
  hospitalPhysician?: HospitalPhysicianEntity;

  @ApiProperty()
  scmWarehouse: WarehouseEntity;

  @ApiProperty({ type: ChargeSlipDetailEntity, isArray: true })
  scmChargeslipDtls: ChargeSlipDetailEntity[];

  @ApiProperty({ type: ReturnEntity, isArray: true })
  scmReturns: ReturnEntity[];

  @ApiProperty()
  postedAt: Date;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedBy: string;

  @ApiProperty()
  updatedAt: Date;
}
