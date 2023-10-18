import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { SharedModule } from '@pwa/src/app/shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ItemDetailServices, ItemLocationDtlServices, ItemLocationServices } from '../../Services';
import { ItemLocationModuleServices } from './item-location.service';
import { Subject } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Prisma, ScmItemLocationDtl } from '@prisma/client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchParams } from '@pwa/src/app/shared/interface';

interface _state {
  list: any[];
  loading: boolean;
  page: number;
  pageSize: number;
  totalItems: number;
}

@Component({
  selector: 'app-item-location',
  templateUrl: './item-location.component.html',
  styleUrls: ['./item-location.component.less'],
  standalone: true,
  imports: [
    SharedModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemLocationComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  isVisibleEnterQuantity = false;

  model: any = {
    locationId: '',
    itemdtlId: null,
    balanceQty: 0
  };

  searchParam: any = {

  }

  stateItemDetail: _state;
  stateLocationHeader: _state;
  stateLocationDetail: _state;

  constructor(
    private cd: ChangeDetectorRef,
    private msg: NzMessageService,
    public service: ItemLocationModuleServices,
    private apiItemDetail: ItemDetailServices,
    private apiItemLocation: ItemLocationServices,
    private destroyRef: DestroyRef,
    private apiItemLocationDtl: ItemLocationDtlServices
  ){
  }

  convertSort(d: string) {
    if (d === 'ascend') {
      return 'asc'
    } else {
      return 'desc'
    }
  }

  loadItemDetail() {
    this.service._loadingItemDetail.set(true);
    this.searchParam = {
      state: 'Active'
    }
      
    const numberOfFilters = Object.keys(this.searchParam).length;
    const params: SearchParams<Prisma.ScmItemDtlWhereInput, Prisma.ScmItemDtlOrderByWithRelationAndSearchRelevanceInput> = {
      pageSize: this.service._pageSizeItemDetails(),
      page: this.service._pageItemDetails(),
      filteredObject: numberOfFilters > 0 ? this.searchParam : {},
      q: this.service._search(),
      orderBy: {},
      pagination: true
    };

    this.apiItemDetail.find(params).subscribe({
      next: (res:any) => {
        this.service._totalItemDetails.set(res.totalItems);
        this.service._itemDetails.set(res.data);
      },
      error: (err: any) => {
        this.msg.warning("Can't load sub-item list!")
      },
      complete: () => {
        this.service._loadingItemDetail.set(false);
        this.cd.detectChanges();
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    let sortOrder = (currentSort && currentSort.value) || null;

    let s: any[] = [];

    if (sortField && sortOrder) { sortOrder = this.convertSort(sortOrder); }
    
    // this._state.order = [{
    //   sortColumn: sortField,
    //   sortDirection: sortOrder,
    // }];
    this.service._pageItemDetails.set(params.pageIndex);
    this.service._pageSizeItemDetails.set(params.pageSize);
    this.loadItemDetail();
  }

  loadItemLocHdr() {
    this.service._loadingItemLocations.set(true);
    const numberOfFilters = Object.keys({state: 'Active'}).length;
    const params: SearchParams<Prisma.ScmItemLocationWhereInput, Prisma.ScmItemLocationOrderByWithRelationAndSearchRelevanceInput> = {
      pageSize: this.service._pageSizeItemLocations(),
      page: this.service._pageItemLocations(),
      filteredObject: numberOfFilters > 0 ? this.searchParam : {},
      orderBy: {
        locName: 'asc'
      },
      pagination: true
    };

    // {pagination: true, orderBy: {locName: 'asc'}}
    this.apiItemLocation.list(params).subscribe({
      next: (res:any) => {
        this.service._totalItemLocations.set(res.totalItems);
        this.service._itemLocations.set(res.data);
        console.log('SSSS', this.service._totalItemLocations());
        if (this.service._totalItemLocations() > 0) {
          this.model.locationId = this.service._itemLocations()[0].id;
        };
      },
      error: (err: any) => {
        this.msg.warning("Can't load transaction list!")
      },
      complete: () => {
        this.service._loadingItemLocations.set(false);
        this.cd.detectChanges();
      }
    });
  }

  loadItemLocDetail() {
    this.service._loadingItemLocationDetails.set(true);
    this.searchParam = {
      locationId: this.model.locationId
    };

    const numberOfFilters = Object.keys(this.searchParam).length;
    const params: SearchParams<Prisma.ScmItemLocationDtlWhereInput, Prisma.ScmItemLocationDtlOrderByWithRelationAndSearchRelevanceInput> = {
      pageSize: this.service._pageSizeItemLocationDetails(),
      page: this.service._pageItemLocationDetails(),
      filteredObject: numberOfFilters > 0 ? this.searchParam : {},
      orderBy: {
        scmItemDtl:{subitemName: 'asc'}
      },
      pagination: true
    };

    this.apiItemLocationDtl.list({pagination: true, filteredObject:{locationId: this.model.locationId}, orderBy: {scmItemDtl:{subitemName: 'asc'}}}).subscribe({
      next: (res:any) => {
        this.service._totalItemLocationDetails.set(res.totalItems);
        this.service._itemLocationDetails.set(res.data);
      },
      error: (err: any) => {
        this.msg.warning("Can't load transaction list!")
      },
      complete: () => {
        this.service._loadingItemLocationDetails.set(false);
        this.cd.detectChanges();
      }
    });
  }

  search(e:any) {
    this.service._search.set(e.target.value);
    this.loadItemDetail();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next({});
    this.ngUnsubscribe.complete();
  }

  confirmDelete(d:any) {
    this.delete(d);
  }

  cancel() {

  }

  add(id: string) {
    let list: any[] = this.service._itemLocationDetails();
    list = list.filter((d:any) => d.itemdtlId === id);

    if (list.length > 0) {
      this.msg.warning('Item is already exist!');
    } else {
      this.model.itemdtlId = id;
      this.addEditData(this.model, 'add');
    }

  }

  changePlanogram(e: any) {
    this.model.locationId = e
    this.loadItemLocDetail();
    this.cd.detectChanges();
  }

  enterInitialQty(): void {
    this.isVisibleEnterQuantity = true;
  }

  confirmQty() {
    this.addEditData(this.model, 'add');
  }

  cancelQty() {
    this.isVisibleEnterQuantity = false;
  }

  addEditData(param: ScmItemLocationDtl, method: 'add' | 'edit'): void {
    const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId;
    if (method === 'add') {
      this.apiItemLocationDtl.create
        (param)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: res => {
            console.log('ADDED', res);
            if (res.statusCode === 201) {
              // this.service._itemLocationDetails.mutate(d => d.push(res.data))

              let list: any = [...this.service._itemLocationDetails(), res.data];
              this.service._itemLocationDetails.set(list);
              this.msg.success('Added succesfully');
            } else {
              this.msg.remove(id);
              this.msg.error("There's an error!");
            }
          },
          error: err => {
            if (err.code === 400) {
              this.msg.remove(id);
              this.msg.error('Unsuccessfully saved');
            }
          },
          complete: () => {
            this.msg.remove(id);
          }
        });
    } else {
      // this.apiItemLocationDtl.update(param.id, param);
    }
  }


  delete(data: any) {
    const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId
    this.apiItemLocationDtl.delete(data.id).subscribe({
      next: (res: any) => {
        let list: any = this.service._itemLocationDetails();
        list = list.filter((d:any) => d.id !== data.id);
        this.service._itemLocationDetails.set(list);
        this.msg.remove(id);
        this.msg.success('Item removed successfully');
      },
      error: (err: any) => {
        this.msg.remove(id)
        this.msg.error('Unsuccessfully remove')
      },
      complete: () => {
        this.cd.detectChanges();
      }
    })
  }


  ngOnInit(): void {
    // this.stateItemDetail.loading = true;
    // this.stateItemDetail.list = [];
    // this.stateItemDetail.page = 1;
    // this.stateItemDetail.pageSize = 20;
    // this.stateItemDetail.totalItems = 0;

    // this.stateLocationHeader.loading = true;
    // this.stateLocationHeader.list = [];
    // this.stateLocationHeader.page = 1;
    // this.stateLocationHeader.pageSize = 20;
    // this.stateLocationHeader.totalItems = 0;
    this.loadItemLocHdr();
    this.loadItemLocDetail();
    this.loadItemDetail();
    // this.spinService.setCurrentGlobalSpinStore(false);
    this.cd.detectChanges();
  }
}
