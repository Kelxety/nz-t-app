import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { RefreshTokenStrategy } from '@api/auth/strategy/refreshtoken.strategy';
import { TransformInterceptor } from '@api/lib/interceptor/transform.interceptor';
import { PrismaModule } from '@api/lib/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@api/users/users.module';
import { RoleService } from '@api/role/role.service';

@Module({
  controllers: [UnitController],
  providers: [
    UnitService,
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
export class UnitModule {}
