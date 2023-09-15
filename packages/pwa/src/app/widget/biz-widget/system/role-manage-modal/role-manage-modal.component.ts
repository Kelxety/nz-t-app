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
  imports: [FormsModule, NzFormModule, ReactiveFormsModule, NzGridModule, NzInputModule, NzCheckboxModule]
})
export class RoleManageModalComponent implements OnInit {
  addEditForm!: FormGroup;

  readonly nzModalData: Role = inject(NZ_MODAL_DATA);

  checkOptionsOne = [
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' }
  ];
  checkOptionsTwo = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear', checked: true },
    { label: 'Orange', value: 'Orange' }
  ];
  checkOptionsThree = [
    { label: 'Apple', value: 'Apple', disabled: true, checked: true },
    { label: 'Pear', value: 'Pear', disabled: true },
    { label: 'Orange', value: 'Orange' }
  ];
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

  // 此方法为如果有异步数据需要加载，则在该方法中添加
  protected getAsyncFnData(modalValue: NzSafeAny): Observable<NzSafeAny> {
    return of(modalValue);
  }

  // 返回false则不关闭对话框
  protected getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.addEditForm)) {
      return of(false);
    }
    return of(this.addEditForm.value);
  }

  ngOnInit(): void {
    this.initRoleForm();
    if (!!this.nzModalData) {
      this.addEditForm.patchValue(this.nzModalData);
    }
  }

  log(value: object[]): void {
    console.log(value);
  }
}
