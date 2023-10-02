import { PermissionEntity } from '@api/permission/entities/permission.entity';
import { UserEntity } from '@api/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Role, Permission, User, Prisma } from '@prisma/client';
import { PermissionOnRole } from './permission-on-roll.entity';

export class RoleEntity implements Role {
  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  id: string;

  @ApiProperty()
  roleName: string;

  @ApiProperty()
  roleDesc: string | null;

  @ApiProperty({ type: UserEntity, isArray: true })
  user: User[];

  @ApiProperty({ type: PermissionEntity, isArray: true })
  permission?: PermissionOnRole[];
}
