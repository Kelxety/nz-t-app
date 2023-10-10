import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, HttpParamsService } from '@app/shared';
import { ScmStockLedger } from '@prisma/client';
import { ResType } from '@utils/types/return-types';

@Injectable({
    providedIn: 'root'
})
export class StockLegderServices {
    private _items = signal<ScmStockLedger[]>([])
    public baseUrl = '/api/stock-ledger';

    constructor(private apiService: ApiService, private httpParams: HttpParamsService) { }

    list(params: object = {}): Observable<ResType<ScmStockLedger[]>> {
        const parameters = this.httpParams.convert(params);
        return this.apiService.get(this.baseUrl, parameters);
    }

    get(id: string): Observable<ResType<ScmStockLedger>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.get(url);
    }

    create(data: ScmStockLedger): Observable<string> {
        this._items.mutate(res => res.push(data))
        return this.apiService.post(this.baseUrl, data);
    }

    update(id: string, data: object): Observable<ResType<ScmStockLedger[]>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.put(url, data);
    }

    patch(id: string, data: object): Observable<ResType<ScmStockLedger>> {
        this._items.update(res => res.filter(datas => datas.id === id))
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.patch(url, data);
    }

    delete(id: string): Observable<ResType<ScmStockLedger[]>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.delete(url);
    }

}

