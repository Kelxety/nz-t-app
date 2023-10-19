import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, HttpParamsService } from '@app/shared';
import { Prisma, ScmStockInventory } from '@prisma/client';
import { ResType } from '@utils/types/return-types';
import { SearchParams } from '@pwa/src/app/shared/interface';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class inventoryServices {
    public baseUrl = '/api/inventory';
    public baseUrlFullsearch = '/api/inventory/search';

    constructor(private apiService: ApiService, private httpParams: HttpParamsService) { }

    list(params: SearchParams<Prisma.ScmStockInventoryWhereInput, Prisma.ScmStockInventoryOrderByWithAggregationInput>): Observable<ResType<ScmStockInventory[]>> {
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

    find(params: SearchParams<Prisma.ScmStockInventoryWhereInput, Prisma.ScmStockInventoryOrderByWithAggregationInput>): Observable<ResType<ScmStockInventory[]>> {
        const filteredObject = params.filteredObject ? JSON.stringify(params.filteredObject) : null;
        const orderBy = params.orderBy ? JSON.stringify(params.orderBy) : null;

        let p: HttpParams = new HttpParams({ fromObject: { ...params, filteredObject, orderBy } });

        if (!filteredObject) {
            p = p.delete('filteredObject');
        }

        if (!orderBy) {
            p = p.delete('orderBy');
        }

        return this.apiService.get(this.baseUrlFullsearch, p);
    }

    get(id: string): Observable<ResType<ScmStockInventory>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.get(url);
    }

    create(data: ScmStockInventory): Observable<string> {
        return this.apiService.post(this.baseUrl, data);
    }

    update(id: string, data: object): Observable<ResType<ScmStockInventory[]>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.put(url, data);
    }

    patch(id: string, data: object): Observable<ResType<ScmStockInventory>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.patch(url, data);
    }

    delete(id: string): Observable<ResType<ScmStockInventory[]>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.delete(url);
    }

}

