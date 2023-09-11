import { Module } from '@nestjs/common';
import { HospitalPhysicianService } from './hospital-physician.service';
import { HospitalPhysicianController } from './hospital-physician.controller';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { RoleService } from '@api/role/role.service';
import { TransformInterceptor } from '@api/lib/interceptor/transform.interceptor';
import { PrismaModule } from '@api/lib/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@api/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [HospitalPhysicianController],
  providers: [
    HospitalPhysicianService,
    JwtStrategy,
    RoleService,
    TransformInterceptor,
  ],
  imports: [PrismaModule, PassportModule, UsersModule, JwtModule],
})
export class HospitalPhysicianModule {}
