import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, finalize, of } from 'rxjs';

import { OptionsInterface } from '@core/services/types';
import { ValidatorsService } from '@core/services/validators/validators.service';
import { Prisma, Role, User } from '@prisma/client';
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
import { AccountService } from '@pwa/src/app/core/services/http/system/account.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HospitalOfficeService } from '@pwa/src/app/pages/configuration/Services/office/office.service';
import { WarehouseServices } from '@pwa/src/app/pages/configuration/Services/warehouse/warehouse.service';
import { LoginInOutService } from '@pwa/src/app/core/services/common/login-in-out.service';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, NzFormModule, ReactiveFormsModule, NzCheckboxModule, NzGridModule, NzInputModule, NgIf, NzRadioModule, NzSwitchModule, NzTreeSelectModule, NzSelectModule, NgFor]
})
export class AccountModalComponent implements OnInit {
  private msg = inject(NzMessageService);
  private dataService = inject(AccountService);
  private destroyRef = inject(DestroyRef);
  private officeService = inject(HospitalOfficeService);
  private warehouseService = inject(WarehouseServices);
  private loginService = inject(LoginInOutService);
  private cdr = inject(ChangeDetectorRef);
  addEditForm!: FormGroup;
  readonly nzModalData: Prisma.UserGetPayload<{ include: { office: true; warehouse: true } }> & { role: Array<{ role: Role; roleId: string; userId: string }> } = inject(NZ_MODAL_DATA);
  roleOptions: OptionsInterface[] = [];
  isEdit = false;
  value?: string;
  roleOfUser = [];
  officeOptions: OptionsInterface[] = [];
  warehouseOptions: OptionsInterface[] = [];
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
    let method = '';

    if (this.isEdit) {
      method = 'patch';
    } else {
      method = 'create';
    }
    const newParamRole: Array<{ id: string }> = [];

    this.addEditForm.controls['accountName'].setValue(this.addEditForm.controls['firstName'].value + ' ' + this.addEditForm.controls['lastName'].value);
    const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId;

    this.dataService[method](this.addEditForm.controls['id']?.value, this.addEditForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          if (res.statusCode === 201 || res.statusCode === 200) {
            if (res.statusCode === 201) {
              this.msg.remove(id);
              this.msg.success('Added succesfully');
            } else {
              this.msg.remove(id);
              this.msg.success('Updated succesfully');
            }
          } else {
            this.msg.remove(id);
            this.msg.error("There's an error!");
          }
        },
        error: err => {
          console.log(err);
          this.msg.remove(id);
        },
        complete: () => {
          this.cdr.detectChanges();
        }
      });

    // return of(false);
    return of(this.addEditForm.value);
  }

  getRoleList(): Promise<void> {
    return new Promise<void>(resolve => {
      this.roleService
        .getRoles({ page: 0, pageSize: 0, pagination: false })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: res => {
            res.data.forEach(({ id, roleName }) => {
              const obj: OptionsInterface = {
                label: roleName,
                value: id!,
                checked: false
              };
              this.roleOptions.push(obj);
            });
          },
          complete: () => {
            resolve();
          }
        });
    });
  }

  getOfficeList(): Promise<void> {
    return new Promise<void>(resolve => {
      this.officeService
        .list({ pagination: false })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: e => {
            if (e.statusCode === 200) {
              e.data.forEach(office => {
                const obj: OptionsInterface = {
                  label: office.officeName,
                  value: office.id,
                  checked: false
                };
                this.officeOptions.push(obj);
              });
            }
          },
          error: err => {
            console.log(err);
          },
          complete: () => {
            this.cdr.detectChanges();
            resolve();
          }
        });
    });
  }

  getWarehouseList(): Promise<void> {
    return new Promise<void>(resolve => {
      this.warehouseService
        .list({ pagination: false })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: e => {
            if (e.statusCode === 200) {
              e.data.forEach(warehouse => {
                const obj: OptionsInterface = {
                  label: warehouse.whName + ' (' + warehouse.whAcro + ') ',
                  value: warehouse.id
                };
                this.warehouseOptions.push(obj);
              });
            }
          },
          error: err => {
            console.log(err);
          },
          complete: () => {
            this.cdr.detectChanges();
            resolve();
          }
        });
    });
  }

  getStatusOfUser(value: string): boolean {
    if (!value || value === 'inactive') return false;
    if (value.toLocaleLowerCase() === 'active' || value.toLocaleLowerCase() === 'true') return true;
    return false;
  }

  getRolesForUser(role: Array<{ roleId: string; userId: string; role: Role }>): OptionsInterface[] {
    const newRole = [];
    this.roleOptions.forEach((userRole, id) => {
      role.forEach(role => {
        if (userRole.value === role.role.id) {
          newRole.push(userRole.value);
        }
      });
    });
    return newRole;
  }

  initForm(): void {
    this.addEditForm = this.fb.group({
      id: [null],
      username: [null, [Validators.required]],
      accountName: [null],
      firstName: [null, [Validators.required]],
      middleName: [null],
      lastName: [null, [Validators.required]],
      password: ['a123456', [Validators.required, this.validatorsService.passwordValidator()]],
      gender: ['MALE'],
      status: this.getStatusOfUser('active'),
      telephone: [null, [this.validatorsService.telephoneValidator()]],
      mobile: [null, [this.validatorsService.mobileValidator()]],
      email: [null, [this.validatorsService.emailValidator()]],
      role: [null, [Validators.required]],
      warehouseId: [null, [Validators.required]],
      officeId: [null, [Validators.required]]
    });
  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.isEdit = !!this.nzModalData;

    await Promise.all([this.getRoleList(), this.getOfficeList(), this.getWarehouseList()]);
    if (this.isEdit) {
      this.addEditForm.patchValue({
        ...this.nzModalData,
        status: this.getStatusOfUser(this.nzModalData.status),
        role: this.getRolesForUser(this.nzModalData.role),
        warehouseId: this.nzModalData.warehouse?.id,
        officeId: this.nzModalData.office?.id
      });
      this.addEditForm.controls['password'].disable();
      this.cdr.detectChanges();
    }
    this.cdr.detectChanges();
  }
}
