import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaModule } from '@api/lib/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '@api/users/users.service';

@Module({
  controllers: [RoleController],
  providers: [RoleService, UsersService],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
    }),
  ],
})
export class RoleModule {}
