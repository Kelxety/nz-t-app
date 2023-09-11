import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@app/config/actionCode';
import { MessageService } from '@core/services/common/message.service';
import { OptionsInterface, SearchCommonVO } from '@core/services/types';
// import { User as UserType } from '@prisma/client';
import { User as UserType } from '@prisma/client';
import { ResType } from '@pwa/src/app/utils/types/return-types';
import { AccountService } from '@services/system/account.service';
import { AntTableConfig, AntTableComponent } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AuthDirective } from '@shared/directives/auth.directive';
import { MapKeyType, MapPipe, MapSet } from '@shared/pipes/map.pipe';
import { ModalBtnStatus } from '@widget/base-modal';
import { AccountModalService } from '@widget/biz-widget/system/account-modal/account-modal.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { DeptTreeComponent } from './dept-tree/dept-tree.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CardTableWrapComponent,
    PageHeaderComponent,
    NzGridModule,
    DeptTreeComponent,
    NzCardModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NgIf,
    NzSelectModule,
    NgFor,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    AntTableComponent,
    AuthDirective,
    NzSwitchModule
  ]
})
export class AccountComponent implements OnInit {
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<any>;
  @ViewChild('availableFlag', { static: true }) availableFlag!: TemplateRef<NzSafeAny>;
  searchParam: Partial<UserType> = {};
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Account management (database is restored from backup every 10 minutes)',
    breadcrumb: ['Front page', 'User Management', 'Account Management']
  };
  dataList: UserType[] = [];
  checkedCashArray: UserType[] = [];
  ActionCode = ActionCode;
  isCollapse = true;
  availableOptions: OptionsInterface[] = [];
  destroyRef = inject(DestroyRef);

  constructor(
    private dataService: AccountService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private modalService: AccountModalService,
    private router: Router,
    public message: NzMessageService
  ) {}

  selectedChecked(e: UserType[]): void {
    this.checkedCashArray = [...e];
  }

  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  getDataList(e?: any): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      page: e?.page || this.tableConfig.pageIndex!,
      filteredObject: this.searchParam,
      orderBy: null,
      pagination: e.pagination!
    };
    this.dataService
      .getAccountList(params)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        console.log(res);
        // if (res.statusCode === 200) {
        //   this.dataList = res.data;
        //   this.tableConfig.total = res.total!;
        //   this.tableConfig.pageIndex = 1;
        //   this.tableLoading(false);
        //   this.checkedCashArray = [...this.checkedCashArray];
        // }
        return res;
      });
  }

  setRole(id: string): void {
    this.router.navigate(['/default/system/role-manager/set-role'], { queryParams: { id: id } });
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  add(): void {
    this.modalService
      .show({ nzTitle: 'New' })
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        if (!res || res.status === ModalBtnStatus.Cancel) {
          return;
        }
        this.tableLoading(true);
        this.addEditData(res.modalValue, 'addAccount');
      });
  }

  reloadTable(): void {
    this.message.info('Refresh Successfully');
    this.getDataList();
  }

  edit(id: string): void {
    this.dataService
      .getAccountDetail(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.modalService
          .show({ nzTitle: 'Edit' }, res)
          .pipe(
            finalize(() => {
              this.tableLoading(false);
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(({ modalValue, status }) => {
            if (status === ModalBtnStatus.Cancel) {
              return;
            }
            modalValue.id = id;
            this.tableLoading(true);
            this.addEditData(modalValue, 'editAccount');
          });
      });
  }

  addEditData(param: UserType, methodName: 'editAccount' | 'addAccount'): void {
    this.dataService[methodName](param)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.getDataList();
      });
  }

  changeStatus(e: boolean, id: string): void {
    this.tableConfig.loading = true;
    const people: Partial<UserType> = {
      id,
      status: '!e'
    };
    this.dataService
      .editAccount(people as UserType)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.getDataList();
      });
  }

  allDel(): void {
    if (this.checkedCashArray.length > 0) {
      const tempArrays: string[] = [];
      this.modalSrv.confirm({
        nzTitle: 'You sure you want to delete it？',
        nzContent: 'Unrecoverable after deletion',
        nzOnOk: () => {
          this.checkedCashArray.forEach(item => {
            tempArrays.push(item.id);
          });
          this.tableLoading(true);
          this.dataService
            .delAccount(tempArrays)
            .pipe(
              finalize(() => {
                this.tableLoading(false);
              }),
              takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
              if (this.dataList.length === 1) {
                this.tableConfig.pageIndex--;
              }
              this.getDataList();
              this.checkedCashArray = [];
            });
        }
      });
    } else {
      this.message.error('Please check the data');
      return;
    }
  }

  del(id: string): void {
    const ids: string[] = [id];
    this.modalSrv.confirm({
      nzTitle: 'You sure you want to delete it?',
      nzContent: 'Unrecoverable after deletion',
      nzOnOk: () => {
        this.tableLoading(true);
        this.dataService
          .delAccount(ids)
          .pipe(
            finalize(() => {
              this.tableLoading(false);
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(() => {
            if (this.dataList.length === 1) {
              this.tableConfig.pageIndex--;
            }
            this.getDataList();
          });
      }
    });
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  searchDeptIdUser(departmentId: number): void {
    console.log(departmentId);
    // this.searchParam.id = departmentId;
    // this.getDataList();
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  ngOnInit(): void {
    this.availableOptions = [...MapPipe.transformMapToArray(MapSet.available, MapKeyType.Boolean)];
    this.initTable();
  }

  private initTable(): void {
    this.tableConfig = {
      showCheckbox: true,
      headers: [
        {
          title: 'Username',
          field: 'username',
          width: 100
        },
        {
          title: 'Status',
          width: 100,
          field: 'status',
          tdTemplate: this.availableFlag
        },
        {
          title: 'Name',
          field: 'name',
          width: 100
        },
        {
          title: 'Account Name',
          field: 'accountName',
          width: 100
        },
        {
          title: 'First Name',
          field: 'FirstName',
          width: 100
        },
        {
          title: 'Middle Name',
          field: 'middleName',
          width: 100
        },
        {
          title: 'Last Name',
          field: 'lastName',
          width: 100
        },
        {
          title: 'Gender',
          width: 70,
          field: 'gender',
          pipe: 'sex'
        },
        {
          title: 'Description',
          width: 100,
          field: 'description'
        },
        {
          title: 'Image',
          width: 100,
          field: 'image'
        },
        {
          title: 'Create Time',
          width: 100,
          field: 'createdAt',
          pipe: 'date:yyyy-MM-dd HH:mm'
        },
        {
          title: 'Updated Date',
          width: 100,
          field: 'updatedAt'
        },
        {
          title: 'Department Name',
          width: 100,
          field: 'departmentName'
        },
        {
          title: 'Config',
          tdTemplate: this.operationTpl,
          width: 150,
          fixed: true
        }
      ],
      total: 0,
      loading: true,
      pageSize: 10,
      pageIndex: 1
    };
  }
}
