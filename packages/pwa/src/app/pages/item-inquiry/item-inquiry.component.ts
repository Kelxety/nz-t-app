import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Prisma } from '@prisma/client';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { SharedModule } from '../../shared';
import { DatatableDataSource } from '../../shared/components/datasource';
import { SearchParams } from '../../shared/interface';
import { ModalBtnStatus } from '../../widget/base-modal';
import { ItemDetailServices } from '../configuration/Services/item-detail/item-detail.service';
import { ItemServices } from '../configuration/Services/item/item.service';
import { ItemInquiryModalService } from './item-inquiry-modal/item-inquiry-modal.service';
interface ItemData {
  gender: string;
  name: Name;
  email: string;
}

interface Name {
  title: string;
  first: string;
  last: string;
}


@Component({
  selector: 'app-item-inquiry',
  templateUrl: './item-inquiry.component.html',
  styleUrls: ['./item-inquiry.component.less'],
  standalone: true,
  imports: [SharedModule, NzSegmentedModule, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemInquiryComponent {
  fallback =
    'data:image/png;base64,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';
  isSpinning = false;
  results: any[];
  @ViewChild('searchInput') searchInput: ElementRef;
  search: string = '';
  itemCardData = signal<any>([])
  destroyRef = inject(DestroyRef);

  searchChange$ = new BehaviorSubject('');
  isLoading = false;
  total: number = 0
  totalData: number = 0

  dataParams: SearchParams<Prisma.ScmItemDtlWhereInput, Prisma.ScmItemDtlOrderByWithRelationAndSearchRelevanceInput> = {
    orderBy: [
      { subitemName: 'asc' },
    ],
    page: 1,
    pageSize: 100,
    pagination: true,
  };

  pageMode: any = {
    page: 1,
    totalPage: 0,
    hasNext: true
  }

  dataGridList = false

  gridList = [
    { label: 'Grid', value: 'Grid', icon: 'appstore' },
    { label: 'List', value: 'List', icon: 'bars' },
  ];

  ds = new DatatableDataSource(this.itemDetailServices);

  private destroy$ = new Subject<boolean>();

  constructor(
    private cd: ChangeDetectorRef,
    private itemServices: ItemServices,
    private modalService: ItemInquiryModalService,
    private itemDetailServices: ItemDetailServices,
    private nzMessage: NzMessageService,
    private http: HttpClient,
  ) {

  }

  ngOnInit(): void {

    this.loadData();

    this.ds
      .completed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.nzMessage.warning('Infinite List loaded all');
      });

  }


  handler(a) {
    console.log('here: ', a);
  }


  onSearchFulltext(value: string): void {
    this.isSpinning = true;
    this.searchChange$.next(value);

    const getList = (): Observable<any> =>
      this.itemDetailServices.fulltextFilter({ q: this.search, pagination: false })
        .pipe(
          catchError(() => of({ results: [] })),
          map((res: any) => res.data)
        )
    const optionList$: Observable<any[]> = this.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(getList));
    optionList$.subscribe(data => {
      this.total = data.length
      this.pageMode.hasNext = false
      this.totalData = data.length
      this.itemCardData.set(data)
      this.isSpinning = false;
    });
  }

  onQueryParamsChange(): void {
    if (!this.pageMode.hasNext) {
      return;
    }
    const { page } = this.pageMode;

    this.dataParams = {
      pageSize: 100,
      page: page,
      pagination: true
    };
    console.log(this.dataParams)
    this.loadData()
    this.cd.detectChanges();
  }


  loadData() {
    this.isSpinning = true

    this.itemDetailServices.list(this.dataParams).subscribe({
      next: (res: any) => {
        console.log(res)
        this.total = res.totalItems
        this.pageMode.page = res.page += 1
        this.pageMode.totalPage = res.totalPage
        this.pageMode.hasNext = res.hasNext
        // const list = res.data
        this.totalData += res.data.length
        this.itemCardData.set([...this.itemCardData(), ...res.data])
        // console.log(this.itemCardData())
        // model.list = list;
        // model.filteredList = list;
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        this.isSpinning = false
        // model.loading = false;
        this.cd.detectChanges();
      }
    });
  }


  onClick(data: any) {
    this.modalService
      .show({ nzTitle: `${data?.brandName ? data.brandName + ' | ' : ''}${data.subitemName}`, nzMask: false, nzWrapClassName: 'fullscreen-modal', nzWidth: '250' }, data, '', false)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        if (!res || res.status === ModalBtnStatus.Cancel) {
          return;
        }
        // console.log(res);
        const param = { ...res.modalValue };
        console.log(param)
        // this.tableLoading(true);
        // this.addEditData(param, 'addRoles');
      });
  }

  onClear() {
    this.search = null
    this.loadData()
  }

  onChangeList(event: any) {
    if (event) {
      this.dataGridList = true
    } else {
      this.dataGridList = false
    }
  }


}


