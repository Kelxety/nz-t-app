import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Observable, Subject, of, takeUntil } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

import { Prisma } from '@prisma/client';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { SpinService } from '../../../../core/services/store/common-store/spin.service';
import { SharedModule } from '../../../../shared';
import { SearchParams } from '../../../../shared/interface';
import { ItemServices } from '../../Services/item/item.service';

interface ItemData {
  id: string;
  itemCode: string;
  itemName: string;
  itemDescription: string;
  scmItemCategory: string[];
  scmItemDtl: string[];
  state: string;
}

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.less'],
  standalone: true,
  imports: [SharedModule]
})
export class ItemComponent {
  search: string = '';
  private ngUnsubscribe = new Subject();

  public tableHeight!: number;
  isVisible = false;
  isConfirmLoading = false;

  searchChange$ = new BehaviorSubject('');

  @ViewChild('tableContainer') private readonly _tableContainer!: ElementRef;

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  setOfCheckedId = new Set<string>();

  loading = true;

  model: any = {
    list: [],
    filteredList: [],
    isSubmitting: false,
    loading: true,
    totalItems: 0
  };

  pageSize = 10;
  pageIndex = 1;
  total: 1;

  dataParams: SearchParams<Prisma.ScmItemWhereInput, Prisma.ScmItemOrderByWithRelationAndSearchRelevanceInput> = {
    orderBy: {
      itemName: 'asc',
    },
    pageSize: this.pageSize,
    page: this.pageIndex
  };

  listOfSelection = [];

  constructor(
    private cd: ChangeDetectorRef,
    private spinService: SpinService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private itemServices: ItemServices,
    private modalService: NzModalService,
    private router: Router,
    private routers: ActivatedRoute
  ) { }

  ngOnInit(): void {

    // this.loadData()
    this.spinService.setCurrentGlobalSpinStore(false);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next({});
    this.ngUnsubscribe.complete();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }

    this.listOfSelection = [];
    let opt: any = [];
    if (this.setOfCheckedId.size === 1) {
      opt.push({ text: 'Edit selected', onSelect: () => { } });
    }
    if (this.setOfCheckedId.size >= 1) {
      opt.push({ text: 'Delete selected', onSelect: () => { } });
    }

    this.listOfSelection = opt;
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {


    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    console.log(params)
    this.dataParams = {
      pageSize: pageSize,
      page: pageIndex,

      orderBy: [
        {
          itemName: 'asc'
        },
        {
          itemCode: 'asc'
        }
      ]
    };
    this.loadData()
    this.cd.detectChanges();
  }

  loadData(): void {
    let model: any = this.model;
    model.loading = true;
    this.loading = true

    this.itemServices.list(this.dataParams).subscribe({
      next: (res: any) => {
        const list = res.data
        console.log(res)
        model.totalItems = res.totalItems
        model.list = list;
        model.filteredList = list;
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        this.loading = false
        model.loading = false;
        this.cd.detectChanges();
      }
    });
  }


  onSearchFulltext(value: string): void {
    let model: any = this.model;
    model.loading = true;
    // this.Loading = true
    // if (value.length < 3) {
    //   this.isSpinning = false;
    //   return; // Don't trigger the search if it's less than four characters
    // }
    this.searchChange$.next(value);

    const getList = (): Observable<any> =>
      this.itemServices.fulltextFilter({ q: this.search })
        .pipe(
          catchError(() => of({ results: [] })),
          map((res: any) => res.data)
        )
    const optionList$: Observable<any[]> = this.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(getList));
    optionList$.subscribe(data => {
      console.log(data)
      model.list = data;
      model.filteredList = data;
      model.loading = false;
      // this.Loading = false
      this.cd.detectChanges();
    });
  }

  onAdd() {
    this.router.navigate(['/default/configuration/item-modal']);
  }

  onEdit(data: any): void {
    this.router.navigate(['/default/configuration/item-edit-modal', data]);
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  cancel(): void {
    // this.msg.info('click cancel');
  }

  confirm(data: any): void {
    this.delete(data);
  }

  delete(data: any): void {
    // p: primary model, a: api service, data: row to delete
    let model: any = this.model;
    const id = data.id;
    const load = this.msg.loading('Removing in progress..', { nzDuration: 0 }).messageId;

    this.itemServices
      .delete(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          model.list = model.list.filter((item: any) => item.id !== data.id);
          this.filter(this.search);
          this.msg.remove(load);
          this.cd.detectChanges();
        },
        error: (err: any) => {
          model.list = model.list.filter((item: any) => item.id !== data.id);
          this.filter(this.search);
          this.msg.remove(load);
          this.cd.detectChanges();
          this.msg.warning(err.message);
          this.msg.remove(load);
        },
        complete: () => { }
      });
  }

  filter(f: string) {
    this.search = f;
    this.model.filteredList = this.model.list.filter((d: any) => d.className.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
    console.log('S', this.search);
    this.cd.detectChanges();
  }
}
