import { ApiProperty } from '@nestjs/swagger';
import { ScmUnit } from '@prisma/client';

export class UnitEntity implements ScmUnit {
  @ApiProperty()
  id: string;

  @ApiProperty()
  unitName: string;

  @ApiProperty()
  unitAcro: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedBy: string;

  @ApiProperty()
  updatedAt: Date;
}
