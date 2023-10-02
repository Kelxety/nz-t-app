import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Menu, PageInfo, SearchCommonVO } from '@core/services/types';
import { BaseHttpService } from '@services/base-http.service';
import { Permission, UserStatus } from '@prisma/client';
import { ApiTypeService } from '@pwa/src/app/shared/services/api-type.service';
import { HttpParamsService } from '@pwa/src/app/shared';
import { ResType } from '@pwa/src/app/utils/types/return-types';

export interface MenuListObj {
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

  public getMenuList(params: SearchCommonVO<any>): Observable<ResType<Array<Permission & { isOpen?: boolean; selected?: boolean }>>> {
    const parameters = this.httpParams.convert(params);
    return this.apiService.get<ResType<Permission[]>>(this.baseUrl, parameters);
  }

  public addMenus(param: Permission): Observable<void> {
    return this.apiService.post(this.baseUrl, param);
  }

  public editMenus(id: string, param: Permission): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.put(url, param);
  }

  public delMenus(id: string): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.delete(url);
  }

  public getMenuDetail(id: string): Observable<Permission> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.get(url);
  }

  public getMenuByUser(id: string): Observable<Permission> {
    const url = `${this.baseUrl}/users/${id}`;
    return this.apiService.get(url);
  }
}
