import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { $Enums, Gender, Role } from '@prisma/client';

export class CreateUserDto {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;

  @ApiProperty()
  @IsOptional()
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
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @ApiProperty()
  role?: Role[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  refreshToken?: string;
}
