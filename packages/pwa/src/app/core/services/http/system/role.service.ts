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

export interface Permission {
  hasChildren: boolean;
  menuName: string;
  code: string;
  fatherId: string;
  id: string;
  menuGrade: number;
  permissionVo: Permission[];
  isOpen?: boolean;
  checked: boolean;
}

export interface PutPermissionParam {
  permissionIds: string[];
  roleId: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private _roles = signal<Role[]>([]);
  roles = this._roles.asReadonly();
  public baseUrl = '/api/roles';
  constructor(
    private apiService: ApiTypeService,
    private httpParams: HttpParamsService
  ) {}

  public getRoles(param: SearchParams<Prisma.RoleWhereInput, Prisma.RoleOrderByWithAggregationInput>): Observable<ResType<Role[]>> {
    const parameters = this.httpParams.convert(param);
    return this.apiService.get<ResType<Role[]>>(this.baseUrl, parameters);
  }

  public getRolesDetail(id: string): Observable<ResType<Role & { permission: Array<{ permissionId: string; roleId: string; permission: Permission }> }>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.get(url);
  }

  public addRoles(data: Role): Observable<ResType<Role>> {
    this._roles.set([...this._roles(), data]);
    return this.apiService.post(this.baseUrl, data);
  }

  public getPermissionById(id: string): Observable<ResType<Permission[]>> {
    const url = `/api/permissions/${id}`;
    return this.apiService.get<ResType<Permission[]>>(url);
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

  public updatePermission(param: PutPermissionParam): Observable<NzSafeAny> {
    return this.apiService.patch(`/api/permissions/users/${param.roleId}`, param.permissionIds);
  }
}
