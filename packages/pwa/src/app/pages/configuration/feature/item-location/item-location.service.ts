import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, HttpParamsService } from '@app/shared';
import { Prisma, ScmItemDtl, ScmItemLocation, ScmItemLocationDtl } from '@prisma/client';
import { ResType } from '@utils/types/return-types';

@Injectable({
    providedIn: 'root'
})
export class ItemLocationModuleServices {
    public _search = signal<string>('%')

    public _selectedPlanogram = signal<string>('');
    
    public _loadingItemDetail = signal<boolean>(false)
    public _itemDetails = signal<ScmItemDtl[]>([])
    public _totalItemDetails = signal<number>(0)
    public _pageItemDetails = signal<number>(1)
    public _pageSizeItemDetails = signal<number>(10)

    public _loadingItemLocations = signal<boolean>(false)
    public _itemLocations = signal<ScmItemLocation[]>([])
    public _totalItemLocations = signal<number>(0)
    public _pageItemLocations = signal<number>(1)
    public _pageSizeItemLocations = signal<number>(10)

    public _loadingItemLocationDetails = signal<boolean>(false)
    public _itemLocationDetails = signal<Prisma.ScmItemLocationDtlGetPayload<{include:{scmItemDtl: true}}>[]>([])
    public _totalItemLocationDetails = signal<number>(0)
    public _pageItemLocationDetails = signal<number>(1)
    public _pageSizeItemLocationDetails = signal<number>(10)

    constructor(private apiService: ApiService, private httpParams: HttpParamsService) { }

}
