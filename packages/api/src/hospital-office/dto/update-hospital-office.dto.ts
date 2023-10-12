import { PartialType } from '@nestjs/mapped-types';
import { CreateHospitalOfficeDto } from './create-hospital-office.dto';

export class UpdateHospitalOfficeDto extends PartialType(CreateHospitalOfficeDto) {}
