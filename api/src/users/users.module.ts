import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/lib/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  exports: [UsersService],
})
export class UsersModule {}
