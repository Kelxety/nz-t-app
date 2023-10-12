import { CommonModule, NgFor } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzTypographyModule } from 'ng-zorro-antd/typography';


import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { ItemSelectorComponent } from './feature/item-selector/item-selector.component';
import { FilterPipe } from './pipes/filter.pipe';
import { NumberLoopPipe } from './pipes/number-loop.pipe';
import { ItemComponent } from './ui/item/item.component';
// import { NgxMaskModule } from 'ngx-mask'

const MODULES: any[] = [
  NzCardModule,
  NzBreadCrumbModule,
  NzGridModule,
  NzIconModule,
  NzButtonModule,
  NzToolTipModule,
  NzPipesModule,
  NzAffixModule,
  NzDividerModule,
  NzSegmentedModule,
  NzTabsModule,
  NzInputNumberModule,
  NzImageModule,
  NgFor,
  NzBadgeModule,
  NzRadioModule,
  NzDatePickerModule,
  NzTypographyModule,
  NzTableModule,
  NumberLoopPipe,
  NzInputModule,
  NzModalModule,
  NzSpinModule,
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
  NzLayoutModule,
  NzCollapseModule

  // NgxMaskModule.forRoot()
];

const COMPONENTS: any[] = [
  ItemComponent,
  ItemSelectorComponent
];

const COMPONENTS_DYNAMIC: any[] = [];
const DIRECTIVES: any[] = [];
const PIPES: any[] = [FilterPipe];

const PROVIDERS: any[] = [];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES, ...COMPONENTS, ...DIRECTIVES, ...PIPES],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, ...DIRECTIVES, ...PIPES, ItemSelectorComponent],
  providers: [...PROVIDERS]
})
export class SharedModule { }
