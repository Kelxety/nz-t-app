import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject, signal, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, of } from 'rxjs';

import { Permission, PermissionStatus, Prisma } from '@prisma/client';
import { MenuListObj, PermissionService } from '@pwa/src/app/core/services/http/system/menus.service';
import { RoleService } from '@pwa/src/app/core/services/http/system/role.service';
import { OptionsInterface } from '@pwa/src/app/core/services/types';
import { IconSelComponent } from '@shared/biz-components/icon-sel/icon-sel.component';
import { fnCheckForm } from '@utils/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ResType } from '@pwa/src/app/utils/types/return-types';

// c:url，f:button
type menuType = 'C' | 'F' | string;
type Options = Array<{ label: string; value: string }>;
@Component({
  selector: 'app-menu-modal',
  templateUrl: './permission-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    NzFormModule,
    ReactiveFormsModule,
    NzGridModule,
    NzInputModule,
    NzRadioModule,
    NgIf,
    NzButtonModule,
    IconSelComponent,
    NzInputNumberModule,
    NzSwitchModule,
    NzSelectModule,
    NgFor,
    NzSpaceModule
  ]
})
export class MenuModalComponent implements OnInit {
  readonly nzModalData: MenuListObj = inject(NZ_MODAL_DATA);
  private menuService = inject(PermissionService);
  private destroyRef = inject(DestroyRef);

  validateForm!: FormGroup;
  selIconVisible = false;
  // roleOptions: { label: string; value: string }[] = [];
  parentMenuOptions: OptionsInterface[] = [];
  selectedRole = '';
  menuType: menuType = 'C';
  permissionStatusOptionsActive: PermissionStatus = 'Active';
  permissionStatusOptionsInactive: PermissionStatus = 'Inactive';
  constructor(private modalRef: NzModalRef, private fb: FormBuilder, private roleService: RoleService) {}

  protected getCurrentValue(): Observable<any> {
    if (!fnCheckForm(this.validateForm)) {
      return of(false);
    }
    return of(this.validateForm.value);
  }

  initForm(): void {
    this.validateForm = this.fb.group({
      menuName: [null, [Validators.required]],
      code: [null, [Validators.required]],
      fatherId: [null],
      orderNum: [1],
      menuType: ['C'],
      path: [null, [Validators.required]],
      visible: ['1'],
      status: [PermissionStatus.Active, [Validators.required]],
      isNewLink: [false],
      alIcon: [null],
      icon: [null]
      // role: [null, [Validators.required]],
    });
  }

  seledIcon(e: string): void {
    this.validateForm.get('icon')?.setValue(e);
  }

  setFormStatusByType(methodName: 'disable' | 'enable'): void {
    this.validateForm.get('isNewLink')?.[methodName]();
    this.validateForm.get('icon')?.[methodName]();
    this.validateForm.get('alIcon')?.[methodName]();
    this.validateForm.get('visible')?.[methodName]();
    this.validateForm.get('path')?.[methodName]();
  }

  // getRoleList(): Promise<void> {
  //   return new Promise<void>(resolve => {
  //     this.roleService.getRoles({ page: 0, pageSize: 0, pagination: false }).subscribe(({ data }) => {
  //       data.forEach(({ id, roleName }) => {
  //         const obj: { label: string; value: string } = {
  //           label: roleName,
  //           value: id!
  //         };
  //         this.roleOptions.push(obj);
  //       });
  //       resolve();
  //     });
  //   });
  // }

  changeMenuType(type: menuType): void {
    this.menuType = type;
    if (type === 'F') {
      this.setFormStatusByType('disable');
    } else {
      this.setFormStatusByType('enable');
    }
  }

  getParentId() {
    this.menuService
      .getMenuList({
        pagination: false
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: ResType<Permission[]>) => {
          if (res.statusCode === 200) {
            res.data.forEach(menu => {
              if (!this.nzModalData) {
                this.parentMenuOptions.push({
                  label: menu.menuName,
                  value: menu.id
                });
              } else {
                if (this.nzModalData.id !== menu.id) {
                  this.parentMenuOptions.push({
                    label: menu.menuName,
                    value: menu.id
                  });
                }
              }
            });
          }
        }
      });
  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.getParentId();
    // await Promise.all([this.getRoleList()]);
    if (!!this.nzModalData) {
      this.changeMenuType(this.nzModalData.menuType);
      this.validateForm.patchValue(this.nzModalData);
    }
  }
}
