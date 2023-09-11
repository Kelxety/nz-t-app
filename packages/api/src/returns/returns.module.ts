import { Module } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { ReturnsController } from './returns.controller';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { PrismaModule } from '@api/lib/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { RoleService } from '@api/role/role.service';
import { TransformInterceptor } from '@api/lib/interceptor/transform.interceptor';
import { UsersModule } from '@api/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ReturnsController],
  providers: [ReturnsService, JwtStrategy, RoleService, TransformInterceptor],
  imports: [PrismaModule, PassportModule, UsersModule, JwtModule],
})
export class ReturnsModule {}
