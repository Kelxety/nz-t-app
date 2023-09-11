export class CreateReturnDto {
  id: string;
  fyCode: number;
  sretDate: Date;
  sretRefno: string;
  warehouseId: string;
  chargeslipId: string;
  patientName: string;
  state: string;
  remarks?: string;
  isPosted?: boolean;
  postedBy?: string;
  postedAt?: Date;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}
