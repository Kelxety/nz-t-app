import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Observable, Subject, catchError, debounceTime, map, of, switchMap } from 'rxjs';
import { SpinService } from '../../../../core/services/store/common-store/spin.service';
import { SharedModule } from '../../../../shared';
import { ItemLocationServices } from '../../Services/item-location/item-location.service';
import { CreateEditModalComponent } from './create-edit-modal/create-edit-modal.component';
interface planogramData {
  id: string;
  warehouseId: string;
  locName: string;
  state: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
@Component({
  selector: 'app-planogram',
  templateUrl: './planogram.component.html',
  styleUrls: ['./planogram.component.less'],
  standalone: true,
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanogramComponent {
  search: string = '';
  private ngUnsubscribe = new Subject();
  private msg = Inject(NzMessageService)
  private fb = Inject(FormBuilder)
  // private itemLocationServices = Inject(ItemLocationServices)

  public tableHeight!: number;
  isVisible = false;
  isConfirmLoading = false;

  @ViewChild('tableContainer') private readonly _tableContainer!: ElementRef;

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly planogramData[] = [];
  listOfData: readonly planogramData[] = [];
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
    private modalService: NzModalService,
    private itemLocationServices: ItemLocationServices
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.spinService.setCurrentGlobalSpinStore(false);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next({});
    this.ngUnsubscribe.complete();
  }

  onSearchFulltext(value: string): void {
    let model: any = this.model;
    model.loading = true;

    // if (value.length < 3) {
    //   this.isSpinning = false;
    //   return; // Don't trigger the search if it's less than four characters
    // }
    this.searchChange$.next(value);

    const getList = (): Observable<any> =>
      this.itemLocationServices.fulltextFilter({ q: this.search })
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
      this.cd.detectChanges();
    });
  }


  onCurrentPageDataChange($event: readonly planogramData[]): void {
    this.listOfCurrentPageData = $event;
  }


  add() {
    const dialogRef = this.modalService.create({
      nzTitle: 'Add Planogram',
      nzContent: CreateEditModalComponent,
      nzData: {
        actionType: 'Create'
      },
    });

    dialogRef.componentInstance?.statusData.subscribe(
      ($e) => {
        // console.log('Added:', $e);
        // this.model.list.push($e);
        // this.filter(this.search);
        this.loadData();
        this.cd.detectChanges();
      },
    );
  }

  loadData() {
    let model: any = this.model;
    model.loading = true;

    this.itemLocationServices.list({ pagination: true }).subscribe({
      next: (res: any) => {
        const list = res.data

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


  edit(data: any) {
    const dialogRef = this.modalService.create({
      nzTitle: 'Edit Planogram',
      nzContent: CreateEditModalComponent,
      nzData: {
        id: data,
        actionType: 'Edit'
      },
    });

    dialogRef.componentInstance?.statusData.subscribe(
      ($e) => {
        this.loadData();
        this.cd.detectChanges();
      },
    );
  }

  softDelete(data: any) {

    let model: any = this.model;
    model.loading = true;
    const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId

    // this.validateFormDetail.get('state').setValue('In-Active')
    this.itemLocationServices.patch(data.id, { state: 'In-Active' }).subscribe({
      next: (res: any) => {
        this.msg.remove(id)


      },
      error: (err: any) => {
        model.loading = false
        this.msg.remove(id)
        this.msg.error('Unsuccessfully saved')
      },
      complete: () => {

        this.msg.success('Item updated successfully')
        this.loadData()
        // model.loading = false;
        this.cd.detectChanges();
      }
    })
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

  filter(search: string) {
    throw new Error('Method not implemented.');
  }
}
