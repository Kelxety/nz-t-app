import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { SpinService } from '../../../../core/services/store/common-store/spin.service';
import { SharedModule } from '../../../../shared';
import { TmsRptClassModalComponent } from '../../../../shared/feature/tms-rpt-class-modal/tms-rpt-class-modal.component';
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
    loading: true,
  }

  listOfSelection = [];

  constructor(
    private cd: ChangeDetectorRef,
    private spinService: SpinService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private itemServices: ItemServices,
    private modalService: NzModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.spinService.setCurrentGlobalSpinStore(false);
  }

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

  loadData() {
    let model: any = this.model;
    model.loading = true;

    let order: any = [{
      sortColumn: 'itemCode',
      sortDirection: 'asc'
    }];
    this.itemServices.list({ order: order, pagination: false }).subscribe({
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

  onAdd() {
    this.router.navigate(['/default/configuration/item-modal'])
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

    this.itemServices.delete(id)
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
        if ($e.data.state === 'Active') { $e.data.state = true } else { $e.data.state = false };
        const data: any = { name: $e.data.regionName, value: $e.data['@id'], active: true }
        this.loadData();
        this.cd.detectChanges();
      },
    );
  }

  filter(f: string) {
    this.search = f;
    this.model.filteredList = this.model.list.filter((d: any) => (d.className).toLowerCase().indexOf(this.search.toLowerCase()) > -1);
    console.log('S', this.search);
    this.cd.detectChanges();
  }

}
