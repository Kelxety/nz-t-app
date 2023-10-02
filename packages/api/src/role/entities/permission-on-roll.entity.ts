import { Prisma } from '@prisma/client';

export class PermissionOnRole
  implements Prisma.PermissionOnRolesScalarWhereInput
{
  roleId: string;
  permissionId: string;
}
