import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChargeSlipDetailsModule } from './charge-slip-details/charge-slip-details.module';
import { ChargeSlipModule } from './charge-slip/charge-slip.module';
import { HospitalPatientTypeModule } from './hospital-patient-type/hospital-patient-type.module';
import { HospitalPatientModule } from './hospital-patient/hospital-patient.module';
import { HospitalPhysicianModule } from './hospital-physician/hospital-physician.module';
import { IssuanceModule } from './issuance/issuance.module';
import { ItemCategoryModule } from './item-category/item-category.module';
import { ItemDetailModule } from './item-detail/item-detail.module';
import { ItemLocationDetailModule } from './item-location-detail/item-location-detail.module';
import { ItemLocationModule } from './item-location/item-location.module';
import { ItemRateHistoryModule } from './item-rate-history/item-rate-history.module';
import { ItemModule } from './item/item.module';
import { PrismaModule } from './lib/prisma/prisma.module';
import { PermissionModule } from './permission/permission.module';
import { ReceiveModeModule } from './receive-mode/receive-mode.module';
import { ReceivingDtlModule } from './receiving-dtl/receiving-dtl.module';
import { ReceivingModule } from './receiving/receiving.module';
import { ReturnDetailModule } from './return-detail/return-detail.module';
import { ReturnsModule } from './returns/returns.module';
import { RoleModule } from './role/role.module';
import { StockLedgerCodeModule } from './stock-ledger-code/stock-ledger-code.module';
import { StockLedgerModule } from './stock-ledger/stock-ledger.module';
import { SupplierModule } from './supplier/supplier.module';
import { UnitModule } from './unit/unit.module';
import { UsersModule } from './users/users.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { HospitalOfficeModule } from './hospital-office/hospital-office.module';
import { InventoryModule } from './inventory/inventory.module';

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
    ChargeSlipModule,
    HospitalPatientTypeModule,
    HospitalPhysicianModule,
    ChargeSlipDetailsModule,
    ReturnsModule,
    ReturnDetailModule,
    ReceivingModule,
    SupplierModule,
    ReceiveModeModule,
    ReceivingDtlModule,
    PermissionModule,
    StockLedgerModule,
    StockLedgerCodeModule,
    IssuanceModule,
    HospitalOfficeModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
