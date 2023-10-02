import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Permission } from '@prisma/client';

export class PermissionEntity implements Permission {
  @ApiProperty()
  id: string;

  @ApiProperty()
  menuName: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  fatherId: string | null;

  @ApiProperty()
  orderNum: number;

  @ApiProperty()
  path: string;

  @ApiProperty()
  menuType: string;

  @ApiProperty()
  visible: string;

  @ApiProperty()
  status: $Enums.PermissionStatus;

  @ApiProperty()
  isNewLink: boolean;

  @ApiProperty()
  alIcon: string;

  @ApiProperty()
  icon: string;

  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
