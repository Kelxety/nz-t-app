import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { PrismaModule } from '@api/lib/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { RefreshTokenStrategy } from '@api/auth/strategy/refreshtoken.strategy';
import { UsersModule } from '@api/users/users.module';
import { TransformInterceptor } from '@api/lib/interceptor/transform.interceptor';
import { RoleService } from '@api/role/role.service';

@Module({
  controllers: [WarehouseController],
  providers: [
    WarehouseService,
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
export class WarehouseModule {}
