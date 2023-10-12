import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalPhysician } from '@prisma/client';
import { SharedModule } from '@pwa/src/app/shared';
import { fnCheckForm } from '@pwa/src/app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, of } from 'rxjs';
import { WarehouseServices } from '../../../configuration/Services/warehouse/warehouse.service';
import { HospitalOfficeService } from '../../../configuration/Services/office/office.service';

@Component({
  selector: 'app-create-edit-modal',
  templateUrl: './create-edit-modal.component.html',
  styleUrls: ['./create-edit-modal.component.less'],
  standalone: true,
  imports: [SharedModule]
})
export class CreateEditModalComponent {
  private modalRef = inject(NzModalRef);
  private warehouseServices = inject(WarehouseServices);
  private officeService = inject(HospitalOfficeService);
  readonly nzModalData: { data: HospitalPhysician; actionType: string } = inject(NZ_MODAL_DATA);
  private fb = inject(FormBuilder);

  listOfWarehouse: any[] = [];
  listOfOffice: any[] = [];
  isSubmitting: boolean = false;
  // Declearation
  isEdit = signal<boolean>(false);
  frm!: FormGroup;
  listOfOption = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  // FUNCTIONS
  protected getAsyncFnData(modalValue: NzSafeAny): Observable<NzSafeAny> {
    return of(modalValue);
  }

  protected getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.frm)) {
      return of(false);
    }
    return of(this.frm.value);
  }

  initForm() {
    this.frm = this.fb.group({
      id: [null],
      warehouseId: [null, [Validators.required]],
      officeId: [null, [Validators.required]],
      issDate: [new Date, [Validators.required]],
      state: [this.listOfOption[0].value, [Validators.required]],
      remarks: [null]
    });
  }

  loadWarehouse() {
    this.warehouseServices.list({ pagination: false, state: 'Active' }).subscribe({
      next: (res: any) => {
        const list = res.data;
        this.listOfWarehouse = list;
        list.map((d:any) => {
          if (d.whAcro === 'SR') {
            this.frm.patchValue({
              warehouseId: d.id
            })
          }
        }); 
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        
      }
    });
  }

  loadOffice() {
    this.officeService.list({ pagination: false, state: 'Active' }).subscribe({
      next: (res: any) => {
        const list = res.data;
        this.listOfOffice = list;
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadWarehouse();
    this.loadOffice();

    if (!!this.nzModalData) {
      this.isEdit.set(true);
    }

    if (this.isEdit()) {
      this.frm.patchValue({ ...this.nzModalData.data });
    }
  }
}
