import { Injectable } from '@angular/core';
import { ApiService, HttpParamsService } from '@app/shared';
import { ScmItemCategory } from '@prisma/client';
import { ResType } from '@utils/types/return-types';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ItemCatergoryServices {
    public baseUrl = '/api/item-category';

    constructor(
        private apiService: ApiService,
        private httpParams: HttpParamsService
    ) { }

    list(params: object = {}): Observable<ResType<ScmItemCategory[]>> {
        const parameters = this.httpParams.convert(params);
        return this.apiService.get(this.baseUrl, parameters);
    }

    get(id: string): Observable<any> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.get(url);
    }

    create(data: object): Observable<any> {
        return this.apiService.post(this.baseUrl, data);
    }

    update(id: string, data: object): Observable<any> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.put(url, data);
    }

    delete(id: string): Observable<any> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.delete(url);
    }
}