import { NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NumberLoopPipe } from './pipes/number-loop.pipe';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { MatDialogModule } from '@angular/material/dialog';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';

import { ItemComponent } from './ui/item/item.component';
import { FilterPipe } from './pipes/filter.pipe';
import { LocationBarangayComponent } from './ui/location-barangay/location-barangay.component';
import { LocationRegionComponent } from './feature/location-region/location-region.component';
import { TmsRptClassModalComponent } from './feature/tms-rpt-class-modal/tms-rpt-class-modal.component';
import { TmsRptLedgerModalComponent } from './feature/tms-rpt-ledger-modal/tms-rpt-ledger-modal.component';
import { TmsAccountModalComponent } from './feature/tms-account-modal/tms-account-modal.component';
import { LocationProvinceModalComponent } from './feature/location-province-modal/location-province-modal.component';
import { LocationMunicipalityModalComponent } from './feature/location-municipality-modal/location-municipality-modal.component';
import { LocationBarangayModalComponent } from './feature/location-barangay-modal/location-barangay-modal.component';
import { TmsRptLedgerPaymentModalComponent } from './feature/tms-rpt-ledger-payment/tms-rpt-ledger-payment-modal.component';

// import { NgxMaskModule } from 'ngx-mask'

const MODULES: any[] = [
  NzCardModule,
  NzBreadCrumbModule,
  NzGridModule,
  NzIconModule,
  NzButtonModule,
  NzToolTipModule,
  NzDividerModule,
  NzTabsModule,
  NgFor,
  NzBadgeModule,
  NzRadioModule,
  NzDatePickerModule,
  NzTypographyModule,
  NzTableModule,
  NumberLoopPipe,
  NzInputModule,
  NzModalModule,
  NzFormModule,
  ReactiveFormsModule,
  FormsModule,
  CommonModule,
  NzSkeletonModule,
  NzListModule,
  NzSelectModule,
  NzEmptyModule,
  NzPopconfirmModule,
  NzSwitchModule,
  MatDialogModule,
  NzSpaceModule,
  NzTreeViewModule,
  NzTreeModule,
  NzDropDownModule,
  NzTreeSelectModule,
  NzPageHeaderModule,
  NzDescriptionsModule,
  // NgxMaskModule.forRoot()
];

const COMPONENTS: any[] = [
  ItemComponent,
  LocationBarangayModalComponent,
  LocationMunicipalityModalComponent,
  LocationProvinceModalComponent,
  LocationRegionComponent,
  TmsRptClassModalComponent,
  TmsRptLedgerModalComponent,
  TmsAccountModalComponent,
  LocationBarangayComponent, 
  LocationRegionComponent, 
  TmsRptLedgerPaymentModalComponent,
];

const COMPONENTS_DYNAMIC: any[] = [];
const DIRECTIVES: any[] = [];
const PIPES: any[] = [
  FilterPipe
];

const PROVIDERS: any[] = [

];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES, ...COMPONENTS, ...DIRECTIVES, ...PIPES],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, ...DIRECTIVES, ...PIPES],
  providers: [
    ...PROVIDERS,
  ]
})
export class SharedModule {}
