import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly username: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @MaxLength(32)
  @ApiProperty({ required: true })
  password: string;
}
