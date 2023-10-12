import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHospitalOfficeDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  officeName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  officeAcro: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  state: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  remarks: string;

  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
