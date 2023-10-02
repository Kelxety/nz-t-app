import { HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { Prisma, User } from '@prisma/client';
import { HttpParamsService } from '@pwa/src/app/shared';
import { QueryParams } from '@pwa/src/app/shared/interface';
import { ApiTypeService } from '@pwa/src/app/shared/services/api-type.service';
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
  private _user = signal<User[]>([]);
  users = this._user.asReadonly();
  public baseUrl = '/api/users';

  constructor(private apiService: ApiTypeService, private httpParams: HttpParamsService) {}

  getAccountList(params: QueryParams<Prisma.UserWhereInput>): Observable<ResType<User[]>> {
    const parameters = this.httpParams.convert(params);
    return this.apiService.get<ResType<User[]>>(this.baseUrl, parameters);
  }

  getAccountDetail(id: string): Observable<ResType<User>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.get(url);
  }

  create(data: User): Observable<string> {
    this._user.mutate(res => res.push(data));
    return this.apiService.post(this.baseUrl, data);
  }

  update(id: string, data: object): Observable<ResType<User[]>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.put(url, data);
  }

  patch(id: string, data: object): Observable<ResType<User[]>> {
    console.log('param', data);
    const parameters = this.httpParams.convert(data);
    this._user.update(res => res.filter(datas => datas.id === id));
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.patch(url, parameters);
  }

  delAccount(ids: string[]): Observable<ResType<User[]>> {
    const url = `${this.baseUrl}/${ids}`;
    const newIds = ids?.forEach(id => {});
    return this.apiService.delete(url);
  }

  public editAccount(param: User): Observable<void> {
    const parameters = this.httpParams.convert(param);
    const url = `${this.baseUrl}/${param.id}`;
    return this.apiService.patch(url, parameters);
  }

  public editAccountPsd(params: UserPsd): Observable<string> {
    const url = `${this.baseUrl}/${params.id}`;
    const data: Observable<string> = this.apiService.patch(url, params);
    return data;
  }
}

// constructor(public http: BaseHttpService) {}

//   public getAccount(param: SearchCommonVO<User>): Observable<PageInfo<User>> {
//     return this.http.post('/api/users/', param);
//   }

//   public getAccountList(param: SearchCommonVO<User>): Observable<User[]> {
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/ld+json',
//       Accept: 'application/ld+json'
//     });
//     const data: Observable<User[]> = this.http.get('/api/users/', { param, headers });
//     return data;
//   }

//   public getAccountDetail(id: string): Observable<User> {
//     return this.http.get(`/api/users/${id}/`);
//   }

//   public addAccount(param: User): Observable<void> {
//     return this.http.post('/api/users/', param);
//   }

//   public delAccount(ids: string[]): Observable<void> {
//     return this.http.post('/api/users/del/', { ids });
//   }

//   public editAccount(param: User): Observable<void> {
//     return this.http.put('/api/users/', param);
//   }

//   public editAccountPsd(params: UserPsd): Observable<string> {
//     const data: Observable<string> = this.http.patch(`/api/users/changepass/${params.id}`, params);
//     return data;
//   }
