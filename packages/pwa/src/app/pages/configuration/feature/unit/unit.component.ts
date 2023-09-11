import { ChangeDetectorRef, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { SpinService } from '../../../../core/services/store/common-store/spin.service';
import { SharedModule } from '../../../../shared';
import { UnitServices } from '../../Services/unit/unit.service';
import { CreateEditModalComponent } from './create-edit-modal/create-edit-modal.component';

interface UnitData {
  id: string;
  unitName: string;
  unitAcro: string;
  state: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;

}

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.less'],
  standalone: true,
  imports: [SharedModule]
})
export class UnitComponent {
  search: string = '';
  private ngUnsubscribe = new Subject();

  public tableHeight!: number;
  isVisible = false;
  isConfirmLoading = false;

  @ViewChild('tableContainer') private readonly _tableContainer!: ElementRef;

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly UnitData[] = [];
  listOfData: readonly UnitData[] = [];
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
    private unitServices: UnitServices,
    private modalService: NzModalService,
  ) { }


  ngOnInit(): void {
    this.loadData();
    this.spinService.setCurrentGlobalSpinStore(false);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next({});
    this.ngUnsubscribe.complete();
  }

  add() {
    const dialogRef = this.modalService.create({
      nzTitle: 'Add Unit',
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

  onCurrentPageDataChange($event: readonly UnitData[]): void {
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
    this.unitServices.list({ order: order, pagination: false }).subscribe({
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

    this.unitServices
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
  filter(search: string) {
    throw new Error('Method not implemented.');
  }

}
