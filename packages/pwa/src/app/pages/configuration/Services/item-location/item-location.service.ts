import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, HttpParamsService } from '@app/shared';
import { Prisma, ScmItemLocation } from '@prisma/client';
import { ResType } from '@utils/types/return-types';
import { SearchParams } from '@pwa/src/app/shared/interface';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ItemLocationServices {
    public _items = signal<ScmItemLocation[]>([])
    public baseUrl = '/api/item-location';
    public searchFulltext = '/api/item-location/search';

    constructor(private apiService: ApiService, private httpParams: HttpParamsService) { }

    list(params: SearchParams<Prisma.ScmItemLocationWhereInput, Prisma.ScmItemLocationOrderByWithAggregationInput>): Observable<ResType<ScmItemLocation[]>> {
        const filteredObject = params.filteredObject ? JSON.stringify(params.filteredObject) : null;
        const orderBy = params.orderBy ? JSON.stringify(params.orderBy) : null;

        let p: HttpParams = new HttpParams({ fromObject: { ...params, filteredObject, orderBy } });

        if (!filteredObject) {
            p = p.delete('filteredObject');
        }

        if (!orderBy) {
            p = p.delete('orderBy');
        }

        return this.apiService.get(this.baseUrl, p);
    }

    fulltextFilter(params: object = {}): Observable<ResType<ScmItemLocation[]>> {
        const parameters = this.httpParams.convert(params);
        return this.apiService.get(this.searchFulltext, parameters);
    }

    get(id: string): Observable<ResType<ScmItemLocation>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.get(url);
    }

    create(data: ScmItemLocation): Observable<string> {
        this._items.mutate(res => res.push(data))
        return this.apiService.post(this.baseUrl, data);
    }

    update(id: string, data: object): Observable<ResType<ScmItemLocation[]>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.put(url, data);
    }

    patch(id: string, data: object): Observable<ResType<ScmItemLocation>> {
        this._items.update(res => res.filter(datas => datas.id === id))
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.patch(url, data);
    }

    delete(id: string): Observable<ResType<ScmItemLocation[]>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.delete(url);
    }

}

