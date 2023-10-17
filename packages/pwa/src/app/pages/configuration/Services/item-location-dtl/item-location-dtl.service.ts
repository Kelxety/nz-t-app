import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, HttpParamsService } from '@app/shared';
import { Prisma, ScmItemLocationDtl } from '@prisma/client';
import { ResType } from '@utils/types/return-types';
import { SearchParams } from '@pwa/src/app/shared/interface';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ItemLocationDtlServices {
    public _items = signal<ScmItemLocationDtl[]>([])
    public baseUrl = '/api/item-location-detail';

    constructor(private apiService: ApiService, private httpParams: HttpParamsService) { }

    list(params: SearchParams<Prisma.ScmItemLocationDtlWhereInput, Prisma.ScmItemLocationDtlOrderByWithRelationAndSearchRelevanceInput>): Observable<ResType<ScmItemLocationDtl[]>> {
       const filteredObject = params.filteredObject ? JSON.stringify(params.filteredObject) : null;
       const orderBy = params.orderBy ? JSON.stringify(params.orderBy) : null;
        const p:HttpParams = new HttpParams({ fromObject: { ...params, filteredObject, orderBy}})

        if(!filteredObject) p.delete('filteredObject');
        if(!orderBy) p.delete('orderBy');
        // const parameters = this.httpParams.convert(params);
        return this.apiService.get(this.baseUrl, p);
    }

    get(id: string): Observable<ResType<ScmItemLocationDtl>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.get(url);
    }

    create(data: ScmItemLocationDtl): Observable<ResType<Prisma.ScmItemLocationDtlGetPayload<{include:{scmItemDtl: true}}>>> {
        this._items.mutate(res => res.push(data))
        return this.apiService.post(this.baseUrl, data);
    }

    update(id: string, data: object): Observable<ResType<ScmItemLocationDtl[]>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.put(url, data);
    }

    patch(id: string, data: object): Observable<ResType<ScmItemLocationDtl>> {
        this._items.update(res => res.filter(datas => datas.id === id))
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.patch(url, data);
    }

    delete(id: string): Observable<ResType<ScmItemLocationDtl[]>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.delete(url);
    }

}

