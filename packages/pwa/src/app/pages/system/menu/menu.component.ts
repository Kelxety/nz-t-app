import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@app/config/actionCode';
import { OptionsInterface, SearchCommonVO } from '@core/services/types';
// import { MenuListObj, MenusService } from '@services/system/menus.service';
import { AntTableConfig } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TreeNodeInterface, TreeTableComponent } from '@shared/components/tree-table/tree-table.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { AuthDirective } from '@shared/directives/auth.directive';
import { MapKeyType, MapPipe, MapSet } from '@shared/pipes/map.pipe';
import { fnFlatDataHasParentToTree, fnFlattenTreeDataByDataList } from '@utils/treeTableTools';
import { ModalBtnStatus } from '@widget/base-modal';
import { MenuModalService } from '@pwa/src/app/widget/biz-widget/system/permission-modal/permission-modal.service';
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
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { PermissionService } from '@pwa/src/app/core/services/http/system/menus.service';
import { $Enums, Permission, PermissionStatus, Prisma } from '@prisma/client';

interface SearchParam {
  menuName: number;
  visible: boolean;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageHeaderComponent,
    WaterMarkComponent,
    NzCardModule,
    FormsModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzSelectModule,
    NgFor,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    CardTableWrapComponent,
    TreeTableComponent,
    AuthDirective,
    NgIf,
    NgTemplateOutlet,
    NzTagModule
  ]
})
export class MenuComponent implements OnInit {
  @ViewChild('zorroIconTpl', { static: true }) zorroIconTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('aliIconTpl', { static: true }) aliIconTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('visibleTpl', { static: true }) visibleTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('isNewLink', { static: true }) isNewLink!: TemplateRef<NzSafeAny>;

  ActionCode = ActionCode;
  searchParam: Partial<SearchParam> = {};
  destroyRef = inject(DestroyRef);
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Menu management. After adding a new menu, remember to add the newly added menu permissions to the corresponding role, otherwise it will not be displayed.',
    breadcrumb: ['Front page', 'System Management', 'Menu Management']
  };
  dataList: TreeNodeInterface[] = [];
  visibleOptions: OptionsInterface[] = [];

  constructor(
    private fb: FormBuilder,
    private menuModalService: MenuModalService,
    private dataService: PermissionService,
    private modalSrv: NzModalService,
    public message: NzMessageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  reloadTable(): void {
    this.message.info('Already refreshed');
    this.getDataList();
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize,
      page: this.tableConfig.pageIndex,
      pagination: true
    };
    this.dataService
      .getMenuList(params)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(menuList => {
        if (!menuList.data) return;
        this.dataList = menuList.data;
        this.tableConfig.total = menuList.totalItems!;
        // const target = fnFlatDataHasParentToTree(menuList.data, 'fatherId');
        // console.log(target);
        // this.dataList = fnFlattenTreeDataByDataList(target);
        // console.log(this.dataList);
        this.tableLoading(false);
      });
  }

  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  add(fatherId: string): void {
    this.menuModalService
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
        const param = { ...res.modalValue };
        param.fatherId = fatherId;
        this.tableLoading(true);
        this.addEditData(param, 'addMenus');
      });
  }

  addEditData(param: string & Permission, methodName: 'editMenus' | 'addMenus'): void {
    if (methodName === 'addMenus') {
      if (param.status) {
        param.status = $Enums.PermissionStatus.ACTIVE;
      } else {
        param.status = $Enums.PermissionStatus.INACTIVE;
      }
      if (param.visible) {
        param.visible = '1';
      } else {
        param.visible = '0';
      }
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
    } else {
      this.dataService[methodName](param.id, param)
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
  }

  del(id: number): void {
    this.modalSrv.confirm({
      nzTitle: 'Are you sure you want to delete it?',
      nzContent: 'Unrecoverable after deletion',
      nzOnOk: () => {
        this.tableLoading(true);
        // this.dataService
        //   .delMenus(id)
        //   .pipe(
        //     finalize(() => {
        //       this.tableLoading(false);
        //     }),
        //     takeUntilDestroyed(this.destroyRef)
        //   )
        //   .subscribe(() => {
        //     if (this.dataList.length === 1) {
        //       this.tableConfig.pageIndex--;
        //     }
        //     this.getDataList();
        //   });
      }
    });
  }

  edit(id: string, fatherId: number): void {
    this.dataService
      .getMenuDetail(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        if (res.status) {
          res.status = PermissionStatus.ACTIVE;
        } else {
          res.status = PermissionStatus.INACTIVE;
        }
        return this.menuModalService
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
            modalValue.fatherId = fatherId;
            this.tableLoading(true);
            this.addEditData(modalValue, 'editMenus');
          });
      });
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'menu name',
          width: 230,
          field: 'menuName'
        },
        {
          title: 'zorro icon',
          field: 'icon',
          width: 100,
          tdTemplate: this.zorroIconTpl
        },
        {
          title: 'ali icon',
          field: 'alIcon',
          width: 100,
          tdTemplate: this.aliIconTpl
        },
        {
          title: 'code',
          field: 'code',
          width: 300
        },
        {
          title: 'path',
          field: 'path',
          width: 300
        },
        {
          title: 'sort',
          field: 'orderNum',
          width: 80
        },
        {
          title: 'status',
          field: 'status',
          pipe: 'available',
          width: 100
        },
        {
          title: 'show',
          field: 'visible',
          pipe: 'isOrNot',
          tdTemplate: this.visibleTpl,
          width: 100
        },
        {
          title: 'external link',
          field: 'isNewLink',
          pipe: 'isOrNot',
          tdTemplate: this.isNewLink,
          width: 100
        },
        {
          title: 'creation time',
          field: 'createdAt',
          pipe: 'date:yyyy-MM-dd HH:mm',
          width: 180
        },
        {
          title: 'action',
          tdTemplate: this.operationTpl,
          width: 180,
          fixed: true,
          fixedDir: 'right'
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  ngOnInit(): void {
    this.initTable();
    this.visibleOptions = [...MapPipe.transformMapToArray(MapSet.visible, MapKeyType.Boolean)];
  }
}
