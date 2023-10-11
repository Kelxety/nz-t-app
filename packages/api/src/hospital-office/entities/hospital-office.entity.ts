import { HospitalOffice } from '@prisma/client';

export class HospitalOfficeEntity implements HospitalOffice {
  id: string;
  officeName: string;
  officeAcro: string;
  state: string;
  remarks: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
