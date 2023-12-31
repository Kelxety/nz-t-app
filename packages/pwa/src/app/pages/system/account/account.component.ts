import { NgIf, NgFor, NgStyle, NgClass } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { IconDirective } from '@ant-design/icons-angular';
import { ActionCode } from '@app/config/actionCode';
import { MessageService } from '@core/services/common/message.service';
import { OptionsInterface, SearchCommonVO } from '@core/services/types';
// import { User as UserType } from '@prisma/client';
import { Prisma, User as UserType } from '@prisma/client';
import { WaterMarkComponent } from '@pwa/src/app/shared/components/water-mark/water-mark.component';
import { QueryParams, SearchParams } from '@pwa/src/app/shared/interface';
import { ResType } from '@pwa/src/app/utils/types/return-types';
import { RoleManageModalService } from '@pwa/src/app/widget/biz-widget/system/role-manage-modal/role-manage-modal.service';
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
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
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
import { NzTagModule } from 'ng-zorro-antd/tag';
import { OffListComponent } from './off-list/off-list.component';
import { EnumType } from 'typescript';
import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CardTableWrapComponent,
    WaterMarkComponent,
    PageHeaderComponent,
    NzGridModule,
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
    NzSwitchModule,
    NzTagModule,
    OffListComponent,
    NgStyle,
    NgClass,
    WarehouseListComponent
  ]
})
export class AccountComponent implements OnInit {
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<any>;
  @ViewChild('statusFlag', { static: true }) statusFlag!: TemplateRef<NzSafeAny>;
  @ViewChild('viewTpl', { static: true }) viewTpl!: TemplateRef<any>;
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Account management (database is restored from backup every 10 minutes)',
    breadcrumb: ['Front page', 'User Management', 'Account Management']
  };
  dataList: UserType[] = [];
  checkedCashArray: UserType[] = [];
  ActionCode = ActionCode;
  isCollapse = true;
  statusOptions: OptionsInterface[] = [];
  destroyRef = inject(DestroyRef);
  selectedMenu: 'Office' | 'Warehouse' = 'Office';
  selectedQuery = signal<{ warehouseId: string | null; officeId: string | null }>({
    warehouseId: null,
    officeId: null
  });
  searchParam = signal<Partial<UserType>>({ warehouseId: this.selectedQuery().warehouseId, officeId: this.selectedQuery().officeId });
  searchByUsername = '';
  searchByAccountName = '';
  params: SearchParams<Prisma.UserWhereInput, Prisma.UserOrderByWithAggregationInput> = {
    pageSize: 10,
    page: 1,
    filteredObject: Object.keys(this.searchParam()).length > 0 ? this.searchParam() : null,
    orderBy: [
      {
        firstName: 'asc'
      }
    ],
    pagination: true
  };

  constructor(
    private dataService: AccountService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private modalService: AccountModalService,
    private roleModalService: RoleManageModalService,
    private router: Router,
    public message: NzMessageService
  ) {}

  selectedChecked(e: UserType[]): void {
    this.checkedCashArray = [...e];
  }

  resetForm(): void {
    this.searchByUsername = '';
    this.searchByAccountName = '';
    this.params.filteredObject = {};
    this.getDataList();
  }

  search() {
    this.params.filteredObject = {
      accountName: this.searchByAccountName,
      username: this.searchByUsername
    };
    if (this.searchByAccountName === '' || this.searchByUsername === '') {
      if (this.searchByAccountName === '' && this.searchByUsername === '') {
        this.params.filteredObject = {};
      } else if (this.searchByAccountName === '' && this.searchByUsername !== '') {
        this.params.filteredObject = {
          username: this.searchByUsername
        };
      } else {
        this.params.filteredObject = {
          accountName: this.searchByAccountName
        };
      }
    }
    this.getDataList();
  }

  getDataList(e?: NzTableQueryParams): void {
    const numberOfFilters = Object.keys(this.searchParam).length;
    this.tableConfig.loading = true;
    if (e?.pageIndex) this.params.page = e?.pageIndex;
    if (e?.pageSize) this.params.pageSize = e?.pageSize;
    if (!this.params.filteredObject.warehouseId && !this.params.filteredObject.officeId && !this.params.filteredObject.accountName && !this.params.filteredObject.username) {
      this.params.filteredObject = {};
    }
    this.dataService
      .getAccountList(this.params)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        if (res.statusCode === 200) {
          this.dataList = res.data;
          this.tableConfig.total = res.totalItems!;
          this.tableConfig.pageIndex = 1;
          this.checkedCashArray = [...this.checkedCashArray];
        }
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

  changeSelectedMenu(menu: 'Office' | 'Warehouse'): void {
    this.selectedMenu = menu;
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
        this.reloadTable();
      });
  }

  reloadTable(): void {
    this.message.info('Refresh Successfully');
    this.tableLoading(true);
    this.getDataList();
  }

  edit(id: string): void {
    this.dataService
      .getAccountDetail(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        return this.modalService
          .show({ nzTitle: 'Edit' }, res.data)
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
            this.reloadTable();
          });
      });
  }

  view(id: string): void {
    this.roleModalService
      .show({ nzTitle: '新增' })
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
        const param = { ...res.modalValue };
        this.tableLoading(true);
      });
  }

  changeStatus(e: boolean, id: string): void {
    this.tableConfig.loading = true;
    const people: Partial<UserType> = {
      id,
      status: 'Active'
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
        nzTitle: 'You sure you want to delete it? ',
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

  searchDeptIdUser(departmentId: any): void {
    console.log(departmentId);
    // this.searchParam.id = departmentId;
    // this.getDataList();
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  ngOnInit(): void {
    this.statusOptions = [...MapPipe.transformMapToArray(MapSet.status, MapKeyType.Boolean)];
    this.initTable();
  }

  getUserStatus(status: 'true' | 'Active' | 'false' | 'Inactive'): boolean {
    if (status === 'true' || status === 'Active') return true;
    return false;
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Username',
          field: 'username',
          width: 120
        },
        {
          title: 'Status',
          width: 100,
          field: 'status',
          tdTemplate: this.statusFlag
        },
        {
          title: 'Name',
          field: 'name',
          width: 150
        },
        {
          title: 'Account Name',
          field: 'accountName',
          width: 140
        },
        {
          title: 'First Name',
          field: 'firstName',
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
          title: 'Sex',
          width: 70,
          field: 'gender'
        },
        {
          title: 'Description',
          width: 140,
          field: 'description'
        },
        {
          title: 'Image',
          width: 100,
          field: 'image'
        },
        {
          title: 'Warehouse',
          width: 100,
          field: 'warehouse.whName'
        },
        {
          title: 'Office',
          width: 100,
          field: 'office.officeName'
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
          title: 'Roles',
          width: 150,
          tdTemplate: this.viewTpl,
          fixed: true,
          fixedDir: 'right'
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          width: 120,
          fixed: true,
          fixedDir: 'right'
        }
      ],
      total: 0,
      loading: true,
      pageSize: 10,
      pageIndex: 1
    };
    this.getDataList();
  }
}
