import { PartialType } from '@nestjs/mapped-types';
import { CreateHospitalPhysicianDto } from './create-hospital-physician.dto';

export class UpdateHospitalPhysicianDto extends PartialType(
  CreateHospitalPhysicianDto,
) {}
