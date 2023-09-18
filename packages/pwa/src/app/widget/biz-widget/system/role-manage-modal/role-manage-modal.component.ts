import { NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Role } from '@prisma/client';
import { fnCheckForm } from '@utils/tools';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-role-manage-modal',
  templateUrl: './role-manage-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, NzFormModule, ReactiveFormsModule, NgFor, NzGridModule, NzInputModule, NzCheckboxModule]
})
export class RoleManageModalComponent implements OnInit {
  readonly nzModalData: Role = inject(NZ_MODAL_DATA);

  myForm: any;
  checks: any = [
    { description: 'descr1', value: 'value1' },
    { description: 'descr2', value: 'value2' },
    { description: 'descr3', value: 'value3' }
  ];

  constructor(private modalRef: NzModalRef, private fb: FormBuilder) {}

  initRoleForm(): FormGroup {
    return this.fb.group({
      otherControls: [''],
      myChoices: new FormArray([])
    });
  }

  onCheckChange(event): void {
    const formArray: FormArray = this.myForm.get('myChoices') as FormArray;

    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      /* unselected */
      // find the unselected element
      let i = 0;

      formArray.controls.forEach(ctrl => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }

  protected getAsyncFnData(modalValue: NzSafeAny): Observable<NzSafeAny> {
    return of(modalValue);
  }

  ngOnInit(): void {
    this.initRoleForm();
  }

  log(value: object[]): void {
    console.log(value);
  }
}
