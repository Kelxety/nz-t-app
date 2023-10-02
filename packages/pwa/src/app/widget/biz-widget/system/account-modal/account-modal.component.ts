import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { OptionsInterface } from '@core/services/types';
import { ValidatorsService } from '@core/services/validators/validators.service';
import { Role, User } from '@prisma/client';
import { DeptService } from '@services/system/dept.service';
import { RoleService } from '@services/system/role.service';
import { fnCheckForm } from '@utils/tools';
import { fnAddTreeDataGradeAndLeaf, fnFlatDataHasParentToTree } from '@utils/treeTableTools';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, NzFormModule, ReactiveFormsModule, NzCheckboxModule, NzGridModule, NzInputModule, NgIf, NzRadioModule, NzSwitchModule, NzTreeSelectModule, NzSelectModule, NgFor]
})
export class AccountModalComponent implements OnInit {
  addEditForm!: FormGroup;
  readonly nzModalData: User & { role: Array<{ role: Role; roleId: string; userId: string }> } = inject(NZ_MODAL_DATA);
  roleOptions: OptionsInterface[] = [];
  isEdit = false;
  value?: string;
  roleOfUser = [];
  deptNodes: NzTreeNodeOptions[] = [];
  indeterminate = true;
  allChecked = false;

  constructor(private modalRef: NzModalRef, private fb: FormBuilder, private validatorsService: ValidatorsService, private roleService: RoleService, private deptService: DeptService) {}

  protected getAsyncFnData(modalValue: NzSafeAny): Observable<NzSafeAny> {
    return of(modalValue);
  }

  protected getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.addEditForm)) {
      return of(false);
    }
    return of(this.addEditForm.value);
  }

  getRoleList(): Promise<void> {
    return new Promise<void>(resolve => {
      this.roleService.getRoles({ page: 0, pageSize: 0, pagination: false }).subscribe(({ data }) => {
        data.forEach(({ id, roleName }) => {
          const obj: OptionsInterface = {
            label: roleName,
            value: id!,
            checked: false
          };
          this.roleOptions.push(obj);
        });
        resolve();
      });
    });
  }

  getStatusOfUser(value: string): boolean {
    if (!value || value === 'inactive') return false;
    if (value.toLocaleLowerCase() === 'active' || value.toLocaleLowerCase() === 'true') return true;
    return false;
  }

  getRolesForUser(role: Array<{ roleId: string; userId: string; role: Role }>): OptionsInterface[] {
    this.roleOptions.forEach((rolling, id) => {
      role.forEach(role => {
        if (rolling.value === role.role.id) {
          this.roleOptions[id].checked = true;
        }
      });
    });
    return this.roleOptions;
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.roleOptions = this.roleOptions.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.roleOptions = this.roleOptions.map(item => ({
        ...item,
        checked: false
      }));
    }
  }

  updateSingleChecked(): void {
    if (this.roleOptions.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.roleOptions.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  initForm(): void {
    this.addEditForm = this.fb.group({
      username: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      middleName: [null],
      lastName: [null, [Validators.required]],
      password: ['a123456', [Validators.required, this.validatorsService.passwordValidator()]],
      gender: ['MALE'],
      status: this.getStatusOfUser('active'),
      telephone: [null, [this.validatorsService.telephoneValidator()]],
      mobile: [null, [this.validatorsService.mobileValidator()]],
      email: [null, [this.validatorsService.emailValidator()]],
      role: [this.roleOptions, [Validators.required]]
    });
  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.isEdit = !!this.nzModalData;
    await Promise.all([this.getRoleList()]);
    if (this.isEdit) {
      this.addEditForm.patchValue({ ...this.nzModalData, status: this.getStatusOfUser(this.nzModalData.status), role: this.getRolesForUser(this.nzModalData.role) });
      this.addEditForm.controls['password'].disable();
    }
  }
}
