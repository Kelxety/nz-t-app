import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SpinService } from '@pwa/src/app/core/services/store/common-store/spin.service';
import { SharedModule } from '@pwa/src/app/shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IssuanceService } from '../../configuration/Services/issuance/issuance.service';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject, takeUntil } from 'rxjs';
import { Prisma, ScmIssuance } from '@prisma/client';
import { orderBy } from 'lodash';
import { SearchParams } from '@pwa/src/app/shared/interface';
import { ResType } from '@pwa/src/app/utils/types/return-types';

interface State {
  filter: any;
  page: number;
  pageSize: number;
  order: any;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
  standalone: true,
  imports: [SharedModule]
})
export class ListComponent {
  private ngUnsubscribe = new Subject();

  isVisible = false;
  isConfirmLoading = false;

  mainModel: any = {
    list: [],
    filteredList: [],
    isSubmitting: false,
    loading: false
  };

  _state: State = {
    filter: {},
    page: 1,
    pageSize: 10,
    order: [
      {
        sortColumn: 'sort',
        sortDirection: 'asc'
      }
    ]
  };

  //for deletion
  _params: SearchParams<Prisma.ScmIssuanceWhereInput, Prisma.ScmIssuanceOrderByWithAggregationInput> = {
    orderBy: {
      id: 'asc',
      isPosted: 'asc'
    },
    filteredObject: {
      risId: ''
    }
  };

  totalItems = 1;
  loading = true;

  search: string = '';

  constructor(private cd: ChangeDetectorRef, private spinService: SpinService, private fb: FormBuilder, private msg: NzMessageService, private api: IssuanceService, private router: Router) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.tableHeight = (this._tableContainer.nativeElement as HTMLImageElement).clientHeight - 500; // X depend of your page display
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next({});
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    let order: any = [
      {
        sortColumn: 'sort',
        sortDirection: 'asc'
      }
    ];

    this._state.order = order;

    this._state.filter = {
      contest: ''
    };

    this.loadData();
    this.spinService.setCurrentGlobalSpinStore(false);
  }

  loadData() {
    let model: any = this.mainModel;
    this.loading = true;
    this.api.list(this._params).subscribe({
      next: (res: ResType<ScmIssuance[]>) => {
        const list = res.data[1];
        this.totalItems = 1;
      },
      error: (err: any) => {
        this.msg.warning("Can't load transaction list!");
      },
      complete: () => {
        this.loading = false;
        this.cd.detectChanges();
      }
    });
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

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    let sortOrder = (currentSort && currentSort.value) || null;

    let s: any[] = [];

    if (sortField && sortOrder) {
      sortOrder = this.convertSort(sortOrder);
    }

    this._state.order = [
      {
        sortColumn: sortField,
        sortDirection: sortOrder
      }
    ];
    this._state.page = params.pageIndex;
    this._state.pageSize = params.pageSize;

    this.loadData();
  }

  convertSort(d: string) {
    if (d === 'ascend') {
      return 'asc';
    } else {
      return 'desc';
    }
  }

  delete(data: any): void {
    // p: primary model, a: api service, data: row to delete
    let model: any = this.mainModel;
    const id = data.id;
    const load = this.msg.loading('Removing in progress..', { nzDuration: 0 }).messageId;

    this.api
      .delete(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          model.list = model.list.filter((item: any) => item.id !== data.id);
          this.msg.remove(load);
          this.cd.detectChanges();
        },
        error: (err: any) => {
          this.msg.warning(err.message);
          this.msg.remove(load);
        },
        complete: () => {}
      });
  }

  add() {}

  edit(d: any) {}

  editSort(id: string, sort: any) {
    this.api.update(id, { sort: parseInt(sort.target.value) }).subscribe({
      next: (res: any) => {
        this.msg.success('Successfully sort updated!');
      },
      error: (error: any) => {
        this.msg.error('Something wrong!');
        this.loadData();
      },
      complete: () => {}
    });
  }

  filter() {
    // this.search = f.target.value;
    // this.mainModel.filteredList =  this.mainModel.list.filter((d: any) => (d.ownerName).toLowerCase().indexOf(this.search.toLowerCase())>-1);
    this.cd.detectChanges();

    this._state.filter.q = this.search;

    this.loadData();
  }

  link(id: any) {}
}
