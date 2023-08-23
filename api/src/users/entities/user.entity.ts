import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  image: string;

  @Exclude()
  password: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  role: Role[];

  @ApiProperty()
  accountName: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  middleName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  gender: $Enums.Gender;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  description: string;

  @Exclude()
  refreshToken: string;
}
