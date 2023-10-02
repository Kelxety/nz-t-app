import { Prisma } from '@prisma/client';

export class UserRole implements Prisma.SystemUserRoleUncheckedCreateInput {
  userId: string;
  roleId: string;
}
