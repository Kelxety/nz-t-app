import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class SignupEntity {
  @ApiProperty()
  username: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  role: Role;
}
