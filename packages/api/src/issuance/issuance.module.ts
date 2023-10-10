import { Module } from '@nestjs/common';
import { IssuanceService } from './issuance.service';
import { IssuanceController } from './issuance.controller';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { RefreshTokenStrategy } from '@api/auth/strategy/refreshtoken.strategy';
import { TransformInterceptor } from '@api/lib/interceptor/transform.interceptor';
import { RoleService } from '@api/role/role.service';
import { PrismaModule } from '@api/lib/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@api/users/users.module';

@Module({
  controllers: [IssuanceController],
  providers: [
    IssuanceService,
    JwtStrategy,
    RefreshTokenStrategy,
    TransformInterceptor,
    RoleService,
  ],
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
    }),
    UsersModule,
  ],
})
export class IssuanceModule {}
