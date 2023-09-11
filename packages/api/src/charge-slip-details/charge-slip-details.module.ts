import { Module } from '@nestjs/common';
import { ChargeSlipDetailsService } from './charge-slip-details.service';
import { ChargeSlipDetailsController } from './charge-slip-details.controller';
import { RoleService } from '@api/role/role.service';
import { UsersService } from '@api/users/users.service';
import { PrismaModule } from '@api/lib/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ChargeSlipDetailsController],
  providers: [ChargeSlipDetailsService, RoleService, UsersService],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.ACESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
    }),
  ],
})
export class ChargeSlipDetailsModule {}
