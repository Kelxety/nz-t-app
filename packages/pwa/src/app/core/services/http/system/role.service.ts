import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Prisma, Role } from '@prisma/client';
import { QueryParams, SearchParams } from '@pwa/src/app/shared/interface';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

import { PageInfo, SearchCommonVO } from '../../types';
import { BaseHttpService } from '../base-http.service';

/*
 *  权限
 * */
export interface Permission {
  hasChildren: boolean;
  menuName: string;
  code: string;
  fatherId: number;
  id: number;
  menuGrade: number; // 级别
  permissionVo: Permission[];
  isOpen?: boolean; // 是否折叠
  checked: boolean;
}

// 更新权限参数接口
export interface PutPermissionParam {
  permissionIds: string[];
  roleId: number;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(public http: BaseHttpService) {}

  public getRoles(param: SearchParams<Prisma.RoleWhereInput>): Observable<PageInfo<Role>> {
    return this.http.post('/role/list/', param);
  }

  public getRolesDetail(id: number): Observable<Role> {
    return this.http.get(`/role/${id}/`);
  }

  public addRoles(param: Role): Observable<void> {
    return this.http.post('/role/', param);
  }

  public delRoles(ids: number[]): Observable<void> {
    return this.http.post('/role/del/', { ids });
  }

  public editRoles(param: Role): Observable<void> {
    return this.http.put('/role/', param);
  }

  public getPermissionById(id: string): Observable<string[]> {
    return this.http.get(`/permission/${id}/`);
  }

  public updatePermission(param: PutPermissionParam): Observable<NzSafeAny> {
    return this.http.put('/permission/', param);
  }
}
