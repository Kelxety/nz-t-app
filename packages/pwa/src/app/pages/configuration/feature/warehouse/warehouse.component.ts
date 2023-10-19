import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, catchError, debounceTime, map, of, switchMap } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { CreateEditModalComponent } from './create-edit-modal/create-edit-modal.component';
import { SpinService } from '../../../../core/services/store/common-store/spin.service';
import { SharedModule } from '../../../../shared';
import { WarehouseServices } from '../../Services/warehouse/warehouse.service';
interface WarehouseData {
  id: string;
  whName: string;
  whAcro: string;
  state: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.less'],
  standalone: true,
  imports: [SharedModule]
})
export class WarehouseComponent implements OnInit, OnDestroy {
  search: string = '';
  private ngUnsubscribe = new Subject();

  public tableHeight!: number;
  isVisible = false;
  isConfirmLoading = false;

  @ViewChild('tableContainer') private readonly _tableContainer!: ElementRef;

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly WarehouseData[] = [];
  listOfData: readonly WarehouseData[] = [];
  setOfCheckedId = new Set<string>();

  searchChange$ = new BehaviorSubject('');

  model: any = {
    list: [],
    filteredList: [],
    isSubmitting: false,
    loading: true
  };

  listOfSelection = [];

  constructor(
    private cd: ChangeDetectorRef,
    private spinService: SpinService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private modalService: NzModalService,
    private warehouseServices: WarehouseServices
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.spinService.setCurrentGlobalSpinStore(false);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next({});
    this.ngUnsubscribe.complete();
  }

  onSearchFulltext(value: string): void {
    let model: any = this.model;
    model.loading = true;

    this.searchChange$.next(value);

    const getList = (): Observable<any> =>
      this.warehouseServices.fulltextFilter({ q: this.search }).pipe(
        catchError(() => of({ results: [] })),
        map((res: any) => res.data)
      );
    const optionList$: Observable<any[]> = this.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(getList));
    optionList$.subscribe(data => {
      console.log(data);
      model.list = data;
      model.filteredList = data;
      model.loading = false;
      this.cd.detectChanges();
    });
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
      opt.push({ text: 'Edit selected', onSelect: () => {} });
    }
    if (this.setOfCheckedId.size >= 1) {
      opt.push({ text: 'Delete selected', onSelect: () => {} });
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

  onCurrentPageDataChange($event: readonly WarehouseData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  add(): void {
    const dialogRef = this.modalService.create({
      nzTitle: 'Add Warehouse',
      nzContent: CreateEditModalComponent,
      nzData: {
        actionType: 'Create'
      }
    });

    dialogRef.componentInstance?.statusData.subscribe($e => {
      // console.log('Added:', $e);
      // this.model.list.push($e);
      // this.filter(this.search);
      this.loadData();
      this.cd.detectChanges();
    });
  }

  loadData(): void {
    let model: any = this.model;
    model.loading = true;

    this.warehouseServices.list({ pagination: true }).subscribe({
      next: (res: any) => {
        const list = res.data;

        model.list = list;
        model.filteredList = list;
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        model.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  edit(data: any): void {
    const dialogRef = this.modalService.create({
      nzTitle: 'Edit Warehouse',
      nzContent: CreateEditModalComponent,
      nzData: {
        id: data,
        actionType: 'Edit'
      }
    });

    dialogRef.componentInstance?.statusData.subscribe($e => {
      this.loadData();
      this.cd.detectChanges();
    });
  }

  softDelete(data: any): void {
    let model: any = this.model;
    model.loading = true;
    const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId;

    // this.validateFormDetail.get('state').setValue('In-Active')
    this.warehouseServices.patch(data.id, { state: 'In-Active' }).subscribe({
      next: (res: any) => {
        this.msg.remove(id);
      },
      error: (err: any) => {
        model.loading = false;
        this.msg.remove(id);
        this.msg.error('Unsuccessfully saved');
      },
      complete: () => {
        this.msg.success('Item updated successfully');
        this.loadData();
        // model.loading = false;
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

  filter(search: string): void {
    throw new Error('Method not implemented.');
  }
}
