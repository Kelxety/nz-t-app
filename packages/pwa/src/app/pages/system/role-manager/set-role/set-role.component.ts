import { NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap } from 'rxjs/operators';

import { Menu } from '@core/services/types';
import { Permission } from '@prisma/client';
import { PermissionService } from '@services/system/menus.service';
import { PutPermissionParam, RoleService } from '@services/system/role.service';
import { FooterSubmitComponent } from '@shared/components/footer-submit/footer-submit.component';
import { PageHeaderComponent, PageHeaderType } from '@shared/components/page-header/page-header.component';
import { fnAddTreeDataGradeAndLeaf, fnFlattenTreeDataByDataList, fnStringFlatDataHasParentToTree } from '@utils/treeTableTools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-set-role',
  templateUrl: './set-role.component.html',
  styleUrls: ['./set-role.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    PageHeaderComponent,
    NzCardModule,
    NgFor,
    NzCheckboxModule,
    FormsModule,
    NgIf,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
    NzResultModule,
    NgTemplateOutlet,
    NgStyle,
    FooterSubmitComponent,
    NzWaveModule
  ]
})
export class SetRoleComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Settings permissions',
    desc: 'Current role:',
    breadcrumb: ['Front page', 'User Management', 'Role Management', 'Settings permissions']
  };
  currentRole: any = [];
  authCodeArr: string[] = [];
  permissionList: Array<Menu & { isOpen?: boolean; checked?: boolean }> = [];
  roleName!: string;
  destroyRef = inject(DestroyRef);
  @Input({ required: true }) id!: string;

  constructor(
    private dataService: RoleService,
    private cdr: ChangeDetectorRef,
    private menusService: PermissionService,
    private routeInfo: ActivatedRoute,
    private router: Router,
    public message: NzMessageService
  ) { }

  initPermission(): void {
    this.dataService
      .getRolesDetail(this.id)
      .pipe(
        concatMap(authCodeArr => {
          const tempArr: string[] = [];
          authCodeArr?.data?.permission?.forEach(permission => {
            tempArr.push(permission.permission.code);
          });
          this.authCodeArr = tempArr;
          return this.menusService.getMenuList({
            page: 0,
            pageSize: 0,
            pagination: false,
            q: ''
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(response => {
        const menuArray: Array<
          Permission & { isOpen?: boolean; checked?: boolean }
        > = response.data;
        menuArray.forEach(item => {
          item.isOpen = false;
          item.checked = this.authCodeArr.includes(item.code!);
        });
        this.permissionList = fnAddTreeDataGradeAndLeaf(
          fnStringFlatDataHasParentToTree(menuArray)
        );
        this.cdr.markForCheck();
      });
  }

  getRoleName(): void {
    this.dataService
      .getRolesDetail(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ data }) => {
        this.currentRole = data;
        this.pageHeaderInfo = { ...this.pageHeaderInfo, ...{ desc: `current role: ${data.roleName}` } };
        this.cdr.markForCheck();
      });
  }

  back(): void {
    this.router.navigateByUrl(`/default/system/role-manager`);
  }

  submit(): void {
    const temp = [...this.permissionList];
    const flatArray = fnFlattenTreeDataByDataList(temp);
    const seledAuthArray: string[] = [];
    flatArray.forEach(item => {
      if (item['checked']) {
        seledAuthArray.push(`${item.id}`);
      }
    });
    const param: PutPermissionParam = {
      permissionIds: seledAuthArray,
      roleId: this.id
    };
    this.dataService
      .updatePermission(param)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.message.success('The setting is successful and will take effect after logging in again.');
      });
  }

  _onReuseInit(): void {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.getRoleName();
    this.initPermission();
  }
}
