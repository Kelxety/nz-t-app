import { Component, DestroyRef, inject, signal } from '@angular/core';
import { WarehouseServices } from '../../../configuration/Services/warehouse/warehouse.service';
import { AccountComponent } from '../account.component';
import { ScmWarehouse } from '@prisma/client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.less'],
  standalone: true,
  imports: [NzCardModule, NzInputModule, NgStyle, NzListModule, NgFor, NgClass, NzDescriptionsModule, NgIf, NzGridModule, NzButtonModule, NzIconModule]
})
export class WarehouseListComponent {
  private warehouseService = inject(WarehouseServices);
  private destroyRef = inject(DestroyRef);
  private accComponent = inject(AccountComponent);
  selectedWarehouse = signal<ScmWarehouse | null>(null);

  data = signal<ScmWarehouse[]>([]);
  changeSearch(e: any) {}

  selectedItem(item: ScmWarehouse) {
    if (item.id === this.selectedWarehouse()?.id) return;
    this.selectedWarehouse.set(item);
    this.accComponent.params.filteredObject = {
      ...this.accComponent.params.filteredObject,
      warehouseId: item.id
    };
    this.accComponent.selectedQuery.set({ ...this.accComponent.selectedQuery(), warehouseId: item.id });
    this.accComponent.getDataList();
  }

  removeSelect() {
    this.selectedWarehouse.set(null);
    if (this.accComponent.selectedQuery().officeId) {
      this.accComponent.params.filteredObject = { officeId: this.accComponent.selectedQuery().officeId };
    } else {
      this.accComponent.params.filteredObject = {};
    }

    this.accComponent.selectedQuery.set({ ...this.accComponent.selectedQuery(), warehouseId: null });
    this.accComponent.getDataList();
  }

  initWarehouseService() {
    this.warehouseService
      .list({ pagination: false })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          if (res.statusCode === 200) {
            if (this.accComponent.selectedQuery().warehouseId) {
              console.log(this.accComponent.selectedQuery());

              const selectedItem = res.data.filter(item => item.id === this.accComponent.selectedQuery().warehouseId);
              this.selectedItem(selectedItem[0]);
            }
            this.data.set(res.data);
          }
        }
      });
  }

  ngOnInit() {
    this.initWarehouseService();
  }
}
