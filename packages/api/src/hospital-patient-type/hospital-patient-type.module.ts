import { Module } from '@nestjs/common';
import { HospitalPatientTypeService } from './hospital-patient-type.service';
import { HospitalPatientTypeController } from './hospital-patient-type.controller';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { TransformInterceptor } from '@api/lib/interceptor/transform.interceptor';
import { RoleService } from '@api/role/role.service';
import { PrismaModule } from '@api/lib/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@api/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [HospitalPatientTypeController],
  providers: [
    HospitalPatientTypeService,
    JwtStrategy,
    TransformInterceptor,
    RoleService,
  ],
  imports: [
    PrismaModule,
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
    }),
  ],
})
export class HospitalPatientTypeModule {}
