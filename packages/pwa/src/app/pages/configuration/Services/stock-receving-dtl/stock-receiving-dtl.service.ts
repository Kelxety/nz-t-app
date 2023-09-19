import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, HttpParamsService } from '@app/shared';
import { ScmReceiveDtl } from '@prisma/client';
import { ResType } from '@utils/types/return-types';

@Injectable({
    providedIn: 'root'
})
export class StockReceivingDtlServices {
    private _items = signal<ScmReceiveDtl[]>([])
    public baseUrl = '/api/receiving-dtl';

    constructor(private apiService: ApiService, private httpParams: HttpParamsService) { }

    list(params: object = {}): Observable<ResType<ScmReceiveDtl[]>> {
        const parameters = this.httpParams.convert(params);
        return this.apiService.get(this.baseUrl, parameters);
    }

    get(id: string): Observable<ResType<ScmReceiveDtl>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.get(url);
    }

    create(data: ScmReceiveDtl): Observable<string> {
        this._items.mutate(res => res.push(data))
        return this.apiService.post(this.baseUrl, data);
    }

    update(id: string, data: object): Observable<ResType<ScmReceiveDtl[]>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.put(url, data);
    }

    patch(id: string, data: object): Observable<ResType<ScmReceiveDtl>> {
        this._items.update(res => res.filter(datas => datas.id === id))
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.patch(url, data);
    }

    delete(id: string): Observable<ResType<ScmReceiveDtl[]>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.delete(url);
    }

}

