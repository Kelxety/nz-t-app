import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class ChangePasswordDto {
  @IsString()
  @ApiProperty({ required: true })
  id: string;

  @IsString()
  @ApiProperty({ required: true })
  oldPassword: string;

  @IsString()
  @ApiProperty({ required: true })
  newPassword: string;
}
