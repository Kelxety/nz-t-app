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
  imports: [FormsModule, NzFormModule, ReactiveFormsModule, NzGridModule, NzInputModule, NgIf, NzRadioModule, NzSwitchModule, NzTreeSelectModule, NzSelectModule, NgFor]
})
export class AccountModalComponent implements OnInit {
  addEditForm!: FormGroup;
  readonly nzModalData: User & { role: Role[] } = inject(NZ_MODAL_DATA);
  roleOptions: OptionsInterface[] = [];
  isEdit = false;
  value?: string;
  roleOfUser = [];
  deptNodes: NzTreeNodeOptions[] = [];

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
        this.roleOptions = [];
        data.forEach(({ id, name }) => {
          const obj: OptionsInterface = {
            label: name,
            value: id!
          };
          this.roleOptions.push(obj);
        });
        resolve();
      });
    });
  }

  getStatusOfUser(value: string): boolean {
    if (!value || value === 'inactive') return false;
    if (value.toLocaleLowerCase() === 'active') return true;
    return false;
  }

  getRolesForUser(role: Role[]): string[] {
    role.forEach(role => {
      this.roleOfUser.push(role.id);
    });
    return this.roleOfUser;
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
      role: [this.roleOfUser, [Validators.required]]
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
