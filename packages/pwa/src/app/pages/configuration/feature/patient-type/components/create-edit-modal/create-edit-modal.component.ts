import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalPatientType } from '@prisma/client';
import { SharedModule } from '@pwa/src/app/shared';
import { fnCheckForm } from '@pwa/src/app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, of } from 'rxjs';
import { HospitalPatientTypeService } from '../../../../Services/patient-type/patient-type.service';

@Component({
  selector: 'app-patient-type',
  templateUrl: './create-edit-modal.component.html',
  styleUrls: ['./create-edit-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SharedModule]
})
export class CreateEditModalComponent implements OnInit {
  $patientType = inject(HospitalPatientTypeService);
  private modalRef = inject(NzModalRef);
  readonly nzModalData: { data: HospitalPatientType; actionType: string } = inject(NZ_MODAL_DATA);
  private fb = inject(FormBuilder);

  addEditForm!: FormGroup;
  isEdit = signal<boolean>(false);
  value?: string;

  statusData: any;
  listOfOption = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  constructor() {}

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
      patientTypename: [null, [Validators.required]],
      isPatientselect: [true, [Validators.required]],
      state: [this.listOfOption[0].value, [Validators.required]]
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
