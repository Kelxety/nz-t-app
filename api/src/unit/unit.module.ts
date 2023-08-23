import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { RefreshTokenStrategy } from 'src/auth/strategy/refreshtoken.strategy';
import { TransformInterceptor } from 'src/lib/interceptor/transform.interceptor';
import { PrismaModule } from 'src/lib/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [UnitController],
  providers: [
    UnitService,
    JwtStrategy,
    RefreshTokenStrategy,
    TransformInterceptor,
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
