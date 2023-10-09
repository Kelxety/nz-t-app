import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { UsersService } from '@api/users/users.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}
  matchRoles(roles: string[], userRoles: Role[]) {
    if (!userRoles) return false;
    if (userRoles.length === 0) {
      return false;
    }

    for (const userRole of userRoles) {
      if (roles.includes(userRole.roleName)) {
        return true;
      }
    }

    return false;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const rolesType = await this.usersService.findOne(request.user.id);
    // const user: UserEntity = request.user.role;
    const tempArr: Role[] = [];
    if (rolesType.role.length === 0) return false;
    rolesType.role.forEach((role) => {
      tempArr.push(role.role);
    });
    return this.matchRoles(roles, tempArr);
  }
}
