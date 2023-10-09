import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, HttpParamsService } from '@app/shared';
import { ScmItemDtl } from '@prisma/client';
import { ResType } from '@utils/types/return-types';

@Injectable({
    providedIn: 'root'
})
export class ItemDetailServices {
    private _items = signal<ScmItemDtl[]>([])
    public baseUrl = '/api/item-detail';
    public searchFulltext = '/api/item/search';

    constructor(private apiService: ApiService, private httpParams: HttpParamsService) { }

    list(params: object = {}): Observable<ResType<ScmItemDtl[]>> {
        const parameters = this.httpParams.convert(params);
        return this.apiService.get(this.baseUrl, parameters);
    }

    fulltextFilter(params: object = {}): Observable<ResType<ScmItemDtl[]>> {
        const parameters = this.httpParams.convert(params);
        return this.apiService.get(this.searchFulltext, parameters);
    }

    get(id: string): Observable<ResType<ScmItemDtl>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.get(url);
    }

    create(data: ScmItemDtl): Observable<string> {
        this._items.mutate(res => res.push(data))
        return this.apiService.post(this.baseUrl, data);
    }

    update(id: string, data: object): Observable<ResType<ScmItemDtl[]>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.put(url, data);
    }

    patch(id: string, data: object): Observable<ResType<ScmItemDtl>> {
        this._items.update(res => res.filter(datas => datas.id === id))
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.patch(url, data);
    }

    delete(id: string): Observable<ResType<ScmItemDtl[]>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.delete(url);
    }

}

