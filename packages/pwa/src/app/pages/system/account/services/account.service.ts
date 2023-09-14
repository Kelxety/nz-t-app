import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, HttpParamsService } from '@app/shared';
import { ScmItem, ScmItemDtl, User } from '@prisma/client';
import { ResType } from '@utils/types/return-types';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _users = signal<User[]>([]);
  users = this._users.asReadonly();
  public baseUrl = '/api/users';

  constructor(private apiService: ApiService, private httpParams: HttpParamsService) {}

  list(params: object = {}): Observable<ResType<User[]>> {
    const parameters = this.httpParams.convert(params);
    return this.apiService.get(this.baseUrl, parameters);
  }

  get(id: string): Observable<ResType<User>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.get(url);
  }

  create(data: User): Observable<User> {
    this._users.mutate(res => res.push(data));
    console.log(data);
    return this.apiService.post(this.baseUrl, data);
  }

  update(id: string, data: object): Observable<ResType<User[]>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.put(url, data);
  }

  patch(id: string, data: object): Observable<ResType<User[]>> {
    this._users.update(res => res.filter(datas => datas.id === id));
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.patch(url, data);
  }

  delete(id: string): Observable<ResType<ScmItem[]>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.delete(url);
  }
}
