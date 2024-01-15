import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './lib/prisma/prisma.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { UsersModule } from './users/users.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { StockLedgerModule } from './stock-ledger/stock-ledger.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    RoleModule,
    StockLedgerModule,
    WarehouseModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
