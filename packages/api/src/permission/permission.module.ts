import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PrismaModule } from '@api/lib/prisma/prisma.module';
import { RoleService } from '@api/role/role.service';
import { TransformInterceptor } from '@api/lib/interceptor/transform.interceptor';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@api/users/users.module';

@Module({
  controllers: [PermissionController],
  providers: [
    PermissionService,
    RoleService,
    TransformInterceptor,
    JwtStrategy,
  ],
  imports: [PrismaModule, UsersModule, JwtModule],
})
export class PermissionModule {}
