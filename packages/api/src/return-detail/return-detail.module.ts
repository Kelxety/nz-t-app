import { Module } from '@nestjs/common';
import { ReturnDetailService } from './return-detail.service';
import { ReturnDetailController } from './return-detail.controller';
import { PrismaModule } from '@api/lib/prisma/prisma.module';
import { UsersModule } from '@api/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { RoleService } from '@api/role/role.service';
import { TransformInterceptor } from '@api/lib/interceptor/transform.interceptor';

@Module({
  controllers: [ReturnDetailController],
  providers: [
    ReturnDetailService,
    JwtStrategy,
    RoleService,
    TransformInterceptor,
  ],
  imports: [
    PrismaModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
    }),
  ],
})
export class ReturnDetailModule {}
