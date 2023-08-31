import { Module } from '@nestjs/common';
import { HospitalPatientService } from './hospital-patient.service';
import { HospitalPatientController } from './hospital-patient.controller';
import { PrismaModule } from 'src/lib/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RoleService } from 'src/role/role.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [HospitalPatientController],
  providers: [HospitalPatientService, RoleService, UsersService],
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
    }),
  ],
})
export class HospitalPatientModule {}