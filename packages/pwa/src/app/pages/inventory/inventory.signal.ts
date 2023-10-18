import { Injectable, signal } from '@angular/core';
import { ApiService, HttpParamsService } from '@app/shared';
import { Prisma, ScmItemDtl, ScmItemLocation } from '@prisma/client';

@Injectable({
    providedIn: 'root'
})
export class InventorySignals {
    public _search = signal<string>('%')

    public _selectedPlanogram = signal<string>('');

    public _loading = signal<boolean>(false);
    public _list = signal<Prisma.ScmItemLocationDtlGetPayload<{include:{scmItemDtl: true}}>[]>([]);
    public _totalItems = signal<number>(0);
    public _page = signal<number>(1);
    public _pageSize = signal<number>(20);
    public _hasNext = signal<boolean>(false);

    constructor(private apiService: ApiService, private httpParams: HttpParamsService) { }

}

