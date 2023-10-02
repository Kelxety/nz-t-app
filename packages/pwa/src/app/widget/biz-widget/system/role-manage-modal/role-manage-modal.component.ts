import { NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Permission, Role } from '@prisma/client';
import { PermissionService } from '@pwa/src/app/core/services/http/system/menus.service';
import { OptionsInterface } from '@pwa/src/app/core/services/types';
import { fnCheckForm } from '@utils/tools';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { MenuService } from 'ng-zorro-antd/menu';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-role-manage-modal',
  templateUrl: './role-manage-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, NzFormModule, ReactiveFormsModule, NzGridModule, NzInputModule]
})
export class RoleManageModalComponent implements OnInit {
  readonly nzModalData: Role & { permission: Permission[] } = inject(NZ_MODAL_DATA);

  addEditForm!: FormGroup;

  constructor(private modalRef: NzModalRef, private fb: FormBuilder) {}

  initForm(): void {
    this.addEditForm = this.fb.group({
      roleName: [null, [Validators.required]],
      roleDesc: [null]
    });
  }

  protected getAsyncFnData(modalValue: NzSafeAny): Observable<NzSafeAny> {
    return of(modalValue);
  }

  protected getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.addEditForm)) {
      return of(false);
    }
    return of(this.addEditForm.value);
  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    if (!!this.nzModalData) {
      this.addEditForm.patchValue(this.nzModalData);
    }
  }
}
