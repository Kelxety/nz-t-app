import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RoleEntity implements Role {
  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
  status: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedBy: string;

  @ApiProperty()
  updatedAt: Date;
}
