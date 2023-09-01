import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { SpinService } from '@app/core/services/store/common-store/spin.service';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TmsRptClassService } from '@app/shared/data-access/api';
import { SharedModule } from '@app/shared';
import { TmsRptClassModalComponent } from '@app/shared/feature/tms-rpt-class-modal/tms-rpt-class-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';

interface ItemData {
  id: string;
  accountTitle: string;
  accountCode: string;
  state: string;
}

@Component({
  selector: 'app-tms-class',
  templateUrl: './tms-class.component.html',
  styleUrls: ['./tms-class.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SharedModule
  ]
})
export class TmsClassComponent {
  private ngUnsubscribe = new Subject();

  public tableHeight!: number;
  isVisible = false;
  isConfirmLoading = false;

  @ViewChild('tableContainer') private readonly _tableContainer!: ElementRef;

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  setOfCheckedId = new Set<string>();

  model: any = {
    list: [],
    filteredList: [],
    isSubmitting: false,
    loading: true
  }

  search: string = '';

  listOfSelection = [];
  constructor(
    private cd: ChangeDetectorRef,
    private spinService: SpinService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private apiService: TmsRptClassService,
    private modalService: NzModalService,
  ){}
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tableHeight = (this._tableContainer.nativeElement as HTMLImageElement).clientHeight - 500; // X depend of your page display
      console.log('TABLE H', this.tableHeight);
    });
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
      opt.push({text: 'Edit selected', onSelect: () => {}});
    }
    if (this.setOfCheckedId.size >= 1) {
      opt.push({text: 'Delete selected', onSelect: () => {}});
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

  ngOnInit(): void {
    this.loadData();
    this.spinService.setCurrentGlobalSpinStore(false);
  }

  loadData() {
    let model: any = this.model;
    model.loading = true;
    
    let order: any = [{
      sortColumn: 'accountName',
      sortDirection: 'asc'
    }];
    this.apiService.list({order: order, pagination: false}).subscribe({
      next: (res:any) => {
        const list = res['hydra:member'];

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

  delete(data: any): void { // p: primary model, a: api service, data: row to delete
    let model: any = this.model;
    const id = data.id;
    const load = this.msg.loading('Removing in progress..', { nzDuration: 0 }).messageId;

    this.apiService.delete(id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: () => {
        model.list = model.list.filter((item: any) => item.id !== data.id);
        this.filter(this.search);
        this.msg.remove(load);
        this.cd.detectChanges();
      },
      error: (err:any) => {
        model.list = model.list.filter((item: any) => item.id !== data.id);
        this.filter(this.search);
        this.msg.remove(load);
        this.cd.detectChanges();
        this.msg.warning(err.message);
        this.msg.remove(load);
      },
        complete: () => {
      }
    });
  }

  add() {
    const dialogRef = this.modalService.create({
      nzTitle: 'Add RPT Classification',
      nzContent: TmsRptClassModalComponent,
      nzData: {
        actionType: 'create'
      },
    });

    dialogRef.componentInstance?.statusData.subscribe(
      ($e) => {
        console.log('Added:', $e);
        this.model.list.push($e);
        this.filter(this.search);
        this.cd.detectChanges();
      },
    );
  }

  edit(code: string) {
    const dialogRef = this.modalService.create({
      nzTitle: 'Edit RPT Classification',
      nzContent: TmsRptClassModalComponent,
      nzData: {
        id: code,
        actionType: 'edit'
      },
    });

    dialogRef.componentInstance?.statusData.subscribe(
      ($e) => {
        if($e.data.state === 'Active') { $e.data.state = true } else {$e.data.state = false};
        const data: any = {name: $e.data.regionName, value: $e.data['@id'], active: true}
        this.loadData();
        this.cd.detectChanges();
      },
    );
  }

  filter(f: string) {
    this.search = f;
    this.model.filteredList =  this.model.list.filter((d: any) => (d.className).toLowerCase().indexOf(this.search.toLowerCase())>-1);
    console.log('S', this.search);
    this.cd.detectChanges();
  }
}
