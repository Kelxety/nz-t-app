import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './lib/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { UnitModule } from './unit/unit.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    RoleModule,
    WarehouseModule,
    UnitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
