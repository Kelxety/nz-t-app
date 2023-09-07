import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PageInfo, SearchCommonVO } from '../../types';
import { BaseHttpService } from '../base-http.service';

/*
 * 用户管理
 * */
export interface User {
  id: number;
  password: string;
  userName?: string;
  available?: boolean;
  roleName?: string[];
  sex?: 1 | 0;
  telephone?: string;
  mobile?: string | number;
  email?: string;
  lastLoginTime?: Date;
  oldPassword?: string;
  departmentId?: number;
  departmentName?: string;
}

/*
 * 用户修改密码
 * */
export interface UserPsd {
  id: string;
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(public http: BaseHttpService) {}

  public getAccount(param: SearchCommonVO<User>): Observable<PageInfo<User>> {
    return this.http.post('/api/users/', param);
  }

  public getAccountDetail(id: number): Observable<User> {
    return this.http.get(`/api/users/${id}/`);
  }

  public addAccount(param: User): Observable<void> {
    return this.http.post('/api/users/', param);
  }

  public delAccount(ids: number[]): Observable<void> {
    return this.http.post('/api/users/del/', { ids });
  }

  public editAccount(param: User): Observable<void> {
    return this.http.put('/api/users/', param);
  }

  public editAccountPsd(params: UserPsd): Observable<string> {
    console.log(params);
    return this.http.patch(`/api/users/changepass/${params.id}`, params);
  }
}
