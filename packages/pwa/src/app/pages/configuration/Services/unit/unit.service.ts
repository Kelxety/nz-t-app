import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, HttpParamsService } from '@app/shared';
import { ScmItemDtl, ScmUnit } from '@prisma/client';
import { ResType } from '@utils/types/return-types';

@Injectable({
    providedIn: 'root'
})
export class UnitServices {
    public baseUrl = '/api/unit';
    public searchFulltext = '/api/unit/search';

    constructor(private apiService: ApiService, private httpParams: HttpParamsService) { }

    list(params: object = {}): Observable<ResType<ScmUnit[]>> {
        const parameters = this.httpParams.convert(params);
        return this.apiService.get(this.baseUrl, parameters);
    }

    fulltextFilter(params: object = {}): Observable<ResType<ScmUnit[]>> {
        const parameters = this.httpParams.convert(params);
        return this.apiService.get(this.searchFulltext, parameters);
    }

    get(id: string): Observable<ResType<ScmItemDtl>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.get(url);
    }

    create(data: ScmItemDtl): Observable<string> {

        return this.apiService.post(this.baseUrl, data);
    }

    update(id: string, data: object): Observable<ResType<ScmUnit[]>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.put(url, data);
    }

    patch(id: string, data: object): Observable<ResType<ScmUnit>> {

        const url = `${this.baseUrl}/${id}`;
        return this.apiService.patch(url, data);
    }

    delete(id: string): Observable<ResType<ScmUnit>> {
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.delete(url);
    }
}
