import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpParams } from '@angular/common/http';
import { ApiService, HttpParamsService } from '@app/shared';
import { Prisma, ScmItem, ScmItemDtl } from '@prisma/client';
import { ResType } from '@utils/types/return-types';
import { SearchParams } from '../../../../shared/interface';

@Injectable({
  providedIn: 'root'
})
export class ItemServices {
  private _items = signal<ScmItem[]>([])
  items = this._items.asReadonly()
  public baseUrl = '/api/item';
  public searchFulltext = '/api/item/search';

  constructor(private apiService: ApiService, private httpParams: HttpParamsService) { }

  list(params: SearchParams<Prisma.ScmItemWhereInput, Prisma.ScmItemOrderByWithRelationAndSearchRelevanceInput>): Observable<ResType<ScmItem[]>> {
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

    return this.apiService.get(this.baseUrl, p);;
  }

  fulltextFilter(params: object = {}): Observable<ResType<ScmItem[]>> {
    const parameters = this.httpParams.convert(params);
    return this.apiService.get(this.searchFulltext, parameters);
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
