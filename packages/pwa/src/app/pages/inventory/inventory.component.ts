import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InventorySignals } from './inventory.signal';
import { Prisma, ScmItemDtl, ScmStockInventory } from '@prisma/client';
import { SearchParams } from '../../shared/interface';
import { ResType } from '../../utils/types/return-types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { inventoryServices } from '../../services/api';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.less'],
  standalone: true,
  imports: [
    SharedModule
  ]
})
export class InventoryComponent implements OnInit {
  searchParam: any = {};

  constructor (
    private cd: ChangeDetectorRef,
    private msg: NzMessageService,
    public signals: InventorySignals,
    private api: inventoryServices,
    private modalService: NzModalService,
  ){ }

  convertSort(d: string) {
    if (d === 'ascend') {
      return 'asc'
    } else {
      return 'desc'
    }
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
    this.signals._page.set(params.pageIndex);
    this.signals._pageSize.set(params.pageSize);
    this.loadData();
  }

  search(e:any) {
    this.signals._search.set(e.target.value);
    this.signals._page.set(1);
    this.loadData();
  }

  reload() {
    this.signals._page.set(1);
    this.loadData();
  }

  handler(e:any) {

  }

  loadData() {
    this.signals._loading.set(true);
    this.searchParam = {
      state: 'Active',
    }
      
    const numberOfFilters = Object.keys(this.searchParam).length;
    const params: SearchParams<Prisma.ScmStockInventoryWhereInput, Prisma.ScmStockInventoryOrderByWithRelationAndSearchRelevanceInput> = {
      pageSize: this.signals._pageSize(),
      page: this.signals._page(),
      filteredObject: numberOfFilters > 0 ? this.searchParam : {},
      q: this.signals._search(),
      orderBy: [{
        invDate: 'desc'
      }],
      pagination: true
    };

    this.api.find(params).subscribe({
      next: (res:ResType<ScmStockInventory[]>) => {
        this.signals._list.set(res.data);
        this.signals._totalItems.set(res.totalItems);
        this.signals._hasNext.set(res.hasNext);
      },
      error: (err: any) => {
        this.msg.warning("Can't load sub-item list!")
      },
      complete: () => {
        this.signals._loading.set(false);
        this.cd.detectChanges();
      }
    });
  }

  add() {
    const dialogRef = this.modalService.create({
      nzTitle: 'Inventoy Balance',
      nzContent: ListComponent,
      nzWidth: '90%',
      nzBodyStyle: {'max-height': 'calc(100vh - 300px)', top: '96px', padding: '0px'},
      nzData: {
        actionType: 'Create'
      },
    });

    // dialogRef.componentInstance?.statusData.subscribe(
    //   ($e) => {
    //     this.loadData();
    //     this.cd.detectChanges();
    //   },
    // );
  }

  ngOnInit(): void {
    this.loadData();
    this.cd.detectChanges();
    // this.spinService.setCurrentGlobalSpinStore(false);
  }
}
