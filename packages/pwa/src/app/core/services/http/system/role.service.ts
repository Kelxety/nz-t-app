import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { Prisma, Role } from '@prisma/client';
import { ApiService, HttpParamsService } from '@pwa/src/app/shared';
import { QueryParams, SearchParams } from '@pwa/src/app/shared/interface';
import { ApiTypeService } from '@pwa/src/app/shared/services/api-type.service';
import { ResType } from '@pwa/src/app/utils/types/return-types';
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
  private _roles = signal<Role[]>([]);
  roles = this._roles.asReadonly();
  public baseUrl = '/api/role';
  constructor(private apiService: ApiTypeService, private httpParams: HttpParamsService) {}

  public getRoles(param: SearchParams<Prisma.RoleWhereInput>): Observable<ResType<Role[]>> {
    const parameters = this.httpParams.convert(param);
    return this.apiService.get<ResType<Role[]>>(this.baseUrl, parameters);
  }

  public getRolesDetail(id: string): Observable<ResType<Role>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.get(url);
  }

  public addRoles(data: Role): Observable<ResType<Role>> {
    this._roles.mutate(res => res.push(data));
    return this.apiService.post(this.baseUrl, data);
  }

  public delRoles(ids: string[]): Observable<void> {
    // return this.http.post('/role/del/', { ids });
    const url = `${this.baseUrl}/${ids}`;
    return this.apiService.delete(url);
  }

  public editRoles(id: string, data: Role): Observable<ResType<Role>> {
    this._roles.update(res => res.filter(datas => datas.id === id));
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.patch(url, data);
  }
}
