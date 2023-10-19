import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, signal } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { HospitalOfficeService } from '../../../configuration/Services/office/office.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { HospitalOffice } from '@prisma/client';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AccountComponent } from '../account.component';

@Component({
  selector: 'app-off-list',
  templateUrl: './off-list.component.html',
  styleUrls: ['./off-list.component.less'],
  imports: [NzCardModule, NzInputModule, NgStyle, NzListModule, NgFor, NgClass, NzDescriptionsModule, NgIf, NzGridModule, NzButtonModule, NzIconModule],
  standalone: true
})
export class OffListComponent {
  private officeService = inject(HospitalOfficeService);
  private destroyRef = inject(DestroyRef);
  private accComponent = inject(AccountComponent);
  private cdr = inject(ChangeDetectorRef);
  isLoading = signal<boolean>(false);
  selectedOffice = signal<HospitalOffice | null>(null);

  data = [];
  changeSearch(e: any) {}

  selectedItem(item: HospitalOffice) {
    if (item.id === this.selectedOffice()?.id) return;
    this.selectedOffice.set(item);
    this.accComponent.params.filteredObject = {
      ...this.accComponent.params.filteredObject,
      officeId: item.id
    };
    this.accComponent.selectedQuery.set({ ...this.accComponent.selectedQuery(), officeId: item.id });
    this.accComponent.getDataList();
  }

  removeSelect() {
    this.selectedOffice.set(null);
    if (this.accComponent.selectedQuery().officeId) {
      this.accComponent.params.filteredObject = { warehouseId: this.accComponent.selectedQuery().warehouseId };
    } else {
      this.accComponent.params.filteredObject = {};
    }
    this.accComponent.selectedQuery.set({ ...this.accComponent.selectedQuery(), officeId: null });
    this.accComponent.getDataList();
  }

  refresh() {
    this.isLoading.set(false);
    this.cdr.detectChanges();
  }

  initOfficeService() {
    this.isLoading.set(true);
    this.officeService
      .list({ pagination: false })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          if (res.statusCode === 200) {
            if (this.accComponent.selectedQuery().officeId) {
              const selectedItem = res.data.filter(item => item.id === this.accComponent.selectedQuery().officeId);
              this.selectedItem(selectedItem[0]);
            }
            this.data = res.data;
          }
        },
        complete: () => {
          this.refresh();
        }
      });
  }

  ngOnInit() {
    this.initOfficeService();
  }
}
