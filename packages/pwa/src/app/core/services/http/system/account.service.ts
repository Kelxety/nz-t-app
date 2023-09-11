import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '@prisma/client';
import { ResType } from '@pwa/src/app/utils/types/return-types';

import { PageInfo, SearchCommonVO } from '../../types';
import { BaseHttpService } from '../base-http.service';

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

  public getAccountList(param: SearchCommonVO<User>): Observable<User[]> {
    return this.http.get('/api/users/', param);
  }

  public getAccountDetail(id: string): Observable<User> {
    return this.http.get(`/api/users/${id}/`);
  }

  public addAccount(param: User): Observable<void> {
    return this.http.post('/api/users/', param);
  }

  public delAccount(ids: string[]): Observable<void> {
    return this.http.post('/api/users/del/', { ids });
  }

  public editAccount(param: User): Observable<void> {
    return this.http.put('/api/users/', param);
  }

  public editAccountPsd(params: UserPsd): Observable<string> {
    const data: Observable<string> = this.http.patch(`/api/users/changepass/${params.id}`, params);
    return data;
  }
}
