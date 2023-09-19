import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { SpinService } from '../../../../core/services/store/common-store/spin.service';
import { SharedModule } from '../../../../shared';
import { WarehouseServices } from '../../Services/warehouse/warehouse.service';
import { CreateEditModalComponent } from './create-edit-modal/create-edit-modal.component';

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
export class WarehouseComponent {
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

  add() {
    const dialogRef = this.modalService.create({
      nzTitle: 'Add Warehouse',
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


    this.warehouseServices.list({ pagination: true }).subscribe({
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
      nzTitle: 'Edit Unit',
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
    this.warehouseServices.patch(data.id, { state: 'In-Active' }).subscribe({
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
