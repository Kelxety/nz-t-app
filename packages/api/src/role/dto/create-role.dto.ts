import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  roleName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false, nullable: true })
  roleDesc: string | null;
}
