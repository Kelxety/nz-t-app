import { Module } from '@nestjs/common';
import { ChargeSlipService } from './charge-slip.service';
import { ChargeSlipController } from './charge-slip.controller';
import { PrismaModule } from '@api/lib/prisma/prisma.module';
import { RoleService } from '@api/role/role.service';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@api/users/users.module';
import { RefreshTokenStrategy } from '@api/auth/strategy/refreshtoken.strategy';
import { TransformInterceptor } from '@api/lib/interceptor/transform.interceptor';

@Module({
  controllers: [ChargeSlipController],
  providers: [
    ChargeSlipService,
    RoleService,
    JwtStrategy,
    RefreshTokenStrategy,
    TransformInterceptor,
  ],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
    }),
    UsersModule,
  ],
})
export class ChargeSlipModule {}
