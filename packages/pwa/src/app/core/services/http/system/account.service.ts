import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { Prisma, User } from '@prisma/client';
import { HttpParamsService } from '@pwa/src/app/shared';
import { QueryParams, SearchParams } from '@pwa/src/app/shared/interface';
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

  constructor(
    private apiService: ApiTypeService,
    private httpParams: HttpParamsService
  ) {}

  getAccountList(params: SearchParams<Prisma.UserWhereInput, Prisma.UserOrderByWithAggregationInput>): Observable<ResType<User[]>> {
    const filteredObject = params.filteredObject ? JSON.stringify(params.filteredObject) : null;
    const orderBy = params.orderBy ? JSON.stringify(params.orderBy) : null;

    let p: HttpParams = new HttpParams({ fromObject: { ...params, filteredObject, orderBy } });

    if (!filteredObject) {
      p = p.delete('filteredObject');
    }

    if (!orderBy) {
      p = p.delete('orderBy');
    }
    // const parameters = this.httpParams.convert(params);
    return this.apiService.get<ResType<User[]>>(this.baseUrl, p);
  }

  getAccountDetail(id: string): Observable<ResType<User>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.get(url);
  }

  create(data: User): Observable<string> {
    this._user.set([...this._user(), data]);
    return this.apiService.post(this.baseUrl, data);
  }

  update(id: string, data: object): Observable<ResType<User[]>> {
    const parameters = this.httpParams.convert(data);
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.put(url, parameters);
  }

  patch(id: string, data: object): Observable<ResType<User[]>> {
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
    const url = `${this.baseUrl}/changepass/${params.id}`;
    const data: Observable<string> = this.apiService.patch(url, params);
    return data;
  }
}
