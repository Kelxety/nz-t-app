import { Module } from '@nestjs/common';
import { HospitalOfficeService } from './hospital-office.service';
import { HospitalOfficeController } from './hospital-office.controller';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { RefreshTokenStrategy } from '@api/auth/strategy/refreshtoken.strategy';
import { TransformInterceptor } from '@api/lib/interceptor/transform.interceptor';
import { RoleService } from '@api/role/role.service';
import { PrismaModule } from '@api/lib/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '@api/users/users.service';

@Module({
  controllers: [HospitalOfficeController],
  providers: [
    HospitalOfficeService,
    JwtStrategy,
    RefreshTokenStrategy,
    TransformInterceptor,
    RoleService,
    UsersService,
  ],
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
    }),
  ],
})
export class HospitalOfficeModule {}
