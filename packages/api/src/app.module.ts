import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ItemCategoryModule } from './item-category/item-category.module';
import { ItemDetailModule } from './item-detail/item-detail.module';
import { ItemRateHistoryModule } from './item-rate-history/item-rate-history.module';
import { ItemModule } from './item/item.module';
import { PrismaModule } from './lib/prisma/prisma.module';
import { RoleModule } from './role/role.module';
import { UnitModule } from './unit/unit.module';
import { UsersModule } from './users/users.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ItemLocationModule } from './item-location/item-location.module';
import { ItemLocationDetailModule } from './item-location-detail/item-location-detail.module';
import { HospitalPatientModule } from './hospital-patient/hospital-patient.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    RoleModule,
    WarehouseModule,
    UnitModule,
    ItemCategoryModule,
    ItemRateHistoryModule,
    ItemModule,
    ItemDetailModule,
    ItemLocationModule,
    ItemLocationDetailModule,
    HospitalPatientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}