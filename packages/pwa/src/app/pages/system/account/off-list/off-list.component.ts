import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { HospitalOfficeService } from '../../../configuration/Services/office/office.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { HospitalOffice } from '@prisma/client';

@Component({
  selector: 'app-off-list',
  templateUrl: './off-list.component.html',
  styleUrls: ['./off-list.component.less'],
  imports: [NzCardModule, NzInputModule, NgStyle, NzListModule, NgFor, NgClass, NzDescriptionsModule, NgIf],
  standalone: true
})
export class OffListComponent {
  private officeService = inject(HospitalOfficeService);
  private destroyRef = inject(DestroyRef);
  selectedOffice = signal<HospitalOffice>({
    id: '',
    officeName: '',
    officeAcro: '',
    state: '',
    remarks: '',
    createdBy: '',
    createdAt: undefined,
    updatedBy: '',
    updatedAt: undefined
  });
  data = [];
  changeSearch(e: any) {}

  selectedItem(item: HospitalOffice) {
    if (item.id === this.selectedOffice().id) return;
    this.selectedOffice.set(item);
    console.log(item);
  }

  initOfficeService() {
    this.officeService
      .list({ pagination: false })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          if (res.statusCode === 200) {
            this.data = res.data;
          }
        }
      });
  }

  ngOnInit() {
    this.initOfficeService();
  }
}
