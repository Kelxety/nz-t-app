import { Injectable, signal } from '@angular/core';
import { ApiService, HttpParamsService } from '@app/shared';
import { Prisma, ScmItemDtl, ScmItemLocation, ScmStockInventory } from '@prisma/client';

@Injectable({
    providedIn: 'root'
})
export class InventorySignals {
    public _search = signal<string>('%')

    public _selectedPlanogram = signal<string>('');

    public _loading = signal<boolean>(false);
    public _list = signal<ScmStockInventory[]>([]);
    public _totalItems = signal<number>(0);
    public _page = signal<number>(1);
    public _pageSize = signal<number>(20);
    public _hasNext = signal<boolean>(false);
    public _warehouse_id = signal<string>('107981f7-200c-4918-9529-c898cf10a34c');
    public _warehouse_name = signal<string>('Pharmacy');

    constructor(private apiService: ApiService, private httpParams: HttpParamsService) { }

}

