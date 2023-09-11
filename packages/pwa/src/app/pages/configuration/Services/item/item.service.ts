import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, HttpParamsService } from '@app/shared';
import { ScmItem, ScmItemDtl } from '@prisma/client';
import { ResType } from '@utils/types/return-types';

@Injectable({
  providedIn: 'root'
})
export class ItemServices {
  private _items = signal<ScmItem[]>([])
  items = this._items.asReadonly()
  public baseUrl = '/api/item';

  constructor(private apiService: ApiService, private httpParams: HttpParamsService) { }

  list(params: object = {}): Observable<ResType<ScmItem[]>> {
    const parameters = this.httpParams.convert(params);
    return this.apiService.get(this.baseUrl, parameters);
  }

  get(id: string): Observable<ResType<ScmItem>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.get(url);
  }

  create(data: ScmItem): Observable<string> {
    this._items.mutate(res => res.push(data))
    return this.apiService.post(this.baseUrl, data);
  }

  update(id: string, data: object): Observable<ResType<ScmItemDtl[]>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.put(url, data);
  }

  patch(id: string, data: object): Observable<ResType<ScmItemDtl[]>> {
    this._items.update(res => res.filter(datas => datas.id === id))
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.patch(url, data);
  }

  delete(id: string): Observable<ResType<ScmItem[]>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.delete(url);
  }
}
