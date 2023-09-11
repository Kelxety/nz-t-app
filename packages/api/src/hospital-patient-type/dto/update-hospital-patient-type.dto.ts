import { PartialType } from '@nestjs/mapped-types';
import { CreateHospitalPatientTypeDto } from './create-hospital-patient-type.dto';

export class UpdateHospitalPatientTypeDto extends PartialType(
  CreateHospitalPatientTypeDto,
) {}
