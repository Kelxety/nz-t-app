import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty()
  @IsString()
  menuName: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  fatherId?: string | null;

  @ApiProperty()
  @IsNumber()
  orderNum: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  path?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  menuType?: string;

  @ApiProperty()
  @IsString()
  visible: string;

  @ApiProperty()
  @IsEnum($Enums.PermissionStatus)
  @IsString()
  status: $Enums.PermissionStatus;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isNewLink?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  alIcon?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  icon?: string;

  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
