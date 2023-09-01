import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsArray } from 'class-validator';
import { RefreshTokenEntity } from '@api/auth/entity/refreshToken.entity';
import { RoleEntity } from '@api/role/entities/role.entity';
export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string | null;

  @ApiProperty()
  username: string;

  @ApiProperty()
  image: string | null;

  @Exclude()
  password: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  status: string;

  @ApiProperty({ type: RoleEntity, isArray: true })
  role?: RoleEntity[];

  @ApiProperty()
  accountName: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  middleName: string | null;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  gender: $Enums.Gender | null;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  @IsArray()
  @Exclude()
  refreshToken?: RefreshTokenEntity[];

  // @Exclude()
  // refreshToken: string;
}
