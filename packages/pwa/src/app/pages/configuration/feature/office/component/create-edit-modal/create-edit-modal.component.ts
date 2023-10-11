import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalOffice } from '@prisma/client';
import { SharedModule } from '@pwa/src/app/shared';
import { fnCheckForm } from '@pwa/src/app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-create-edit-modal',
  templateUrl: './create-edit-modal.component.html',
  styleUrls: ['./create-edit-modal.component.less'],
  standalone: true,
  imports: [SharedModule]
})
export class CreateEditModalComponent {
  private modalRef = inject(NzModalRef);
  readonly nzModalData: { data: HospitalOffice; actionType: string } = inject(NZ_MODAL_DATA);
  private fb = inject(FormBuilder);

  // DECLERATION
  isEdit = signal<boolean>(false);
  addEditForm!: FormGroup;
  listOfOption = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  // FUNCTIONS
  protected getAsyncFnData(modalValue: NzSafeAny): Observable<NzSafeAny> {
    return of(modalValue);
  }

  protected getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.addEditForm)) {
      return of(false);
    }
    return of(this.addEditForm.value);
  }

  initForm() {
    this.addEditForm = this.fb.group({
      id: [null],
      officeName: [null, Validators.required],
      officeAcro: [null, Validators.required],
      state: [this.listOfOption[0], null],
      remarks: [null]
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (!!this.nzModalData) {
      this.isEdit.set(true);
    }

    if (this.isEdit()) {
      this.addEditForm.patchValue({ ...this.nzModalData.data });
    }
  }
}
