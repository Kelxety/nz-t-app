import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Gender, Role } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  username: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @MaxLength(32)
  @ApiProperty({ required: true })
  password: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  accountName: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  @MaxLength(32)
  middleName?: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  lastName: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: $Enums.Gender;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  role?: Role[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  refreshToken?: string;
}
