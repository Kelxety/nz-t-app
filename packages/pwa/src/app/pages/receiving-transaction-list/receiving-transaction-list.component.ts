import { ChangeDetectorRef, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { SpinService } from '../../core/services/store/common-store/spin.service';
import { SharedModule } from '../../shared';
import { StockReceivingServices } from '../configuration/Services/stock-receiving/stock-receiving.service';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { ViewDetailListComponent } from './view-detail-list/view-detail-list.component';
interface ReceiveData {
  id: string;
  fyCode: number;
  rcvDate: Date;
  rcvRefno: string;
  warehouseId: string;
  supplierId: string;
  receivemodeId: string;
  purchaserequestNo: string;
  deliveryreceiptNo: string;
  purchaseorderNo: string;
  state: string;
  remarks: string;
  isPosted: boolean;
  postedBy: string;
  postedAt: Date;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;

}

@Component({
  selector: 'app-receiving-transaction-list',
  templateUrl: './receiving-transaction-list.component.html',
  styleUrls: ['./receiving-transaction-list.component.less'],
  standalone: true,
  imports: [SharedModule]
})
export class ReceivingTransactionListComponent {
  search: string = '';
  private ngUnsubscribe = new Subject();

  public tableHeight!: number;
  isVisible = false;
  isConfirmLoading = false;
  selectedRow: any;
  @ViewChild('tableContainer') private readonly _tableContainer!: ElementRef;

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ReceiveData[] = [];
  listOfData: readonly ReceiveData[] = [];
  setOfCheckedId = new Set<string>();

  model: any = {
    list: [],
    filteredList: [],
    isSubmitting: false,
    loading: true
  };

  switchValue = false;

  listOfSelection = [];

  constructor(
    private cd: ChangeDetectorRef,
    private spinService: SpinService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private stockReceivingServices: StockReceivingServices,
    private modalService: NzModalService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadData();
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

  onPosting(event: any) {
    let model: any = this.model;
    model.loading = true;

    let order: any = [
      {
        sortColumn: 'itemCode',
        sortDirection: 'asc'
      }
    ];
    if (event) {
      this.stockReceivingServices.list({ order: order, pagination: false, filteredObject: JSON.stringify({ isPosted: !event }) }).subscribe({
        next: (res: any) => {
          const list = signal(res.data)
          list.mutate(res => {
            model.list.push(...res)
            model.filteredList.push(...res)
          })
          this.cd.detectChanges()
          // model.list = list;
          // model.filteredList = list;
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          model.loading = false;
          this.cd.detectChanges();
        }
      });
    } else {
      this.loadData()
    }
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly ReceiveData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  loadData() {
    let model: any = this.model;
    model.loading = true;

    let order: any = [
      {
        sortColumn: 'itemCode',
        sortDirection: 'asc'
      }
    ];
    this.stockReceivingServices.list({ order: order, pagination: false }).subscribe({
      next: (res: any) => {
        const list = signal(res.data)
        list.mutate(res => {
          model.list.push(...res)
          model.filteredList.push(...res)
        })
        // model.list = list;
        // model.filteredList = list;
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

  delete(data: any): void {
    // p: primary model, a: api service, data: row to delete
    let model: any = this.model;
    const id = data.id;
    const load = this.msg.loading('Removing in progress..', { nzDuration: 0 }).messageId;

    this.stockReceivingServices
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

  onReceive() {
    this.router.navigate(['/default/receiving']);
  }

  onRowClick(data: any) {
    this.selectedRow = data;
    const dialogRef = this.modalService.create({
      nzTitle: 'Items list',
      nzContent: ViewDetailListComponent,
      nzWidth: 1320,
      nzData: {
        actionType: 'View',
        data: this.selectedRow
      },
    });

    // dialogRef.componentInstance?.statusData.subscribe(
    //   ($e) => {
    //     // console.log('Added:', $e);
    //     // this.model.list.push($e);
    //     // this.filter(this.search);
    //     this.loadData();
    //     this.cd.detectChanges();
    //   },
    // );
  }

  onEditClick(event: MouseEvent, data: any) {
    event.stopPropagation(); // Prevent the click event from propagating to the row
    const dialogRef = this.modalService.create({
      nzTitle: 'Edit Receive',
      nzContent: EditModalComponent,
      nzWidth: 720,
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

  onDeleteClick(event: MouseEvent, data: any) {
    event.stopPropagation(); // Prevent the click event from propagating to the row
    // Add your delete logic here, such as showing a confirmation dialog
    // or directly initiating the delete operation
  }

}
