import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Menu, PageInfo, SearchCommonVO } from '@core/services/types';
import { BaseHttpService } from '@services/base-http.service';
import { Permission, Prisma, UserStatus } from '@prisma/client';
import { ApiTypeService } from '@pwa/src/app/shared/services/api-type.service';
import { HttpParamsService } from '@pwa/src/app/shared';
import { ResType } from '@pwa/src/app/utils/types/return-types';
import { SearchParams } from '@pwa/src/app/shared/interface';
import { HttpParams } from '@angular/common/http';

export interface MenuListObj {
  id: string;
  menuName: string;
  code: string;
  alIcon: string;
  icon: string;
  orderNum: number;
  menuType: 'C' | 'F' | string;
  path: string;
  visible: 0 | 1 | string;
  status: UserStatus;
  isNewLink: true | false;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  public baseUrl = '/api/permissions';
  constructor(private apiService: ApiTypeService, private httpParams: HttpParamsService) {}

  public getMenuList(
    params: SearchParams<Prisma.PermissionWhereInput, Prisma.PermissionOrderByWithAggregationInput>
  ): Observable<ResType<Array<Permission & { isOpen?: boolean; selected?: boolean }>>> {
    const filteredObject = params.filteredObject ? JSON.stringify(params.filteredObject) : null;
    const orderBy = params.orderBy ? JSON.stringify(params.orderBy) : null;
    let p: HttpParams = new HttpParams({ fromObject: { ...params, filteredObject, orderBy } });

    if (!filteredObject) {
      p = p.delete('filteredObject');
    }

    if (!orderBy) {
      p = p.delete('orderBy');
    }

    return this.apiService.get<ResType<Permission[]>>(this.baseUrl, p);
  }

  public addMenus(param: Permission): Observable<void> {
    return this.apiService.post(this.baseUrl, param);
  }

  public editMenus(id: string, param: Permission): Observable<ResType<Permission[]>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.patch(url, param);
  }

  public delMenus(id: string): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.delete(url);
  }

  public getMenuDetail(id: string): Observable<ResType<Permission>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.get(url);
  }

  public getMenuByUser(id: string): Observable<Permission> {
    const url = `${this.baseUrl}/users/${id}`;
    return this.apiService.get(url);
  }
}
