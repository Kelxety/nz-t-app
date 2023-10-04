import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, HttpParamsService } from '@app/shared';
import { ScmReceive } from '@prisma/client';
import { ResType } from '@utils/types/return-types';

@Injectable({
    providedIn: 'root'
})
export class StockReceivingPostingServices {
    private _items = signal<ScmReceive[]>([])
    public baseUrl = '/api/receiving/posting';

    constructor(private apiService: ApiService, private httpParams: HttpParamsService) { }

    patch(id: string, data: object): Observable<ResType<ScmReceive>> {
        this._items.update(res => res.filter(datas => datas.id === id))
        const url = `${this.baseUrl}/${id}`;
        return this.apiService.patch(url, data);
    }

}

