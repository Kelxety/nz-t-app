import { PartialType } from '@nestjs/swagger';
import { CreateHospitalPatientDto } from './create-hospital-patient.dto';

export class UpdateHospitalPatientDto extends PartialType(
  CreateHospitalPatientDto,
) {}
