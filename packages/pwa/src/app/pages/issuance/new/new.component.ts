import { CUSTOM_ELEMENTS_SCHEMA, Component, DestroyRef, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { SharedModule } from '@pwa/src/app/shared';
import { Subject, finalize } from 'rxjs';
import { IssuanceModalService } from '../component/issuance-modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScmIssuance } from '@prisma/client';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalBtnStatus } from '@pwa/src/app/widget/base-modal';
import { IssuanceService } from '../../configuration/Services/issuance/issuance.service';
import { AntTableConfig } from '@pwa/src/app/shared/components/ant-table/ant-table.component';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.less'],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class NewComponent implements OnInit {

  private modalService = inject(IssuanceModalService);
  destroyRef = inject(DestroyRef);
  private msg = inject(NzMessageService);
  $issuance = inject(IssuanceService);

  searchChange: Subject<any> = new Subject();
  totalCost: number = 0;
  totalQty: number = 0;
  
  tableConfig = signal<AntTableConfig>({
    headers: [],
    pageSize: 0,
    pageIndex: 0,
    total: 0,
    loading: false
  });

  ngOnInit(): void {
    
  }

  itemFilter: any = {
    view: 'grid', //  grid, list
    search: '',
  }

  listOfWarehouse: any[] = [];
  listOfOffice: any[] = [];
  listOfSelectedItems: any[] = [];

  isSubmitting: boolean = false;
  constructor() {
    this.listOfSelectedItems = [];
  }

    // FUNCTIONS
    refresh() {
      this.tableConfig.mutate(t => (t.loading = true));
      this.$issuance.refresh.update(r => !r);
      this.tableConfig.mutate(t => (t.loading = false));
    }

  resetData() {
    this.listOfSelectedItems = [];
  }

  getSelectedItem(event: any) {
    this.listOfSelectedItems = [{...event},...this.listOfSelectedItems];
    this.getTotal();
  }

  getTotal() {
    let t_cost: number = 0;
    let t_qty: number = 0;

    this.listOfSelectedItems.map((d:any) => {
      t_cost += d.cost * d.qty;
      t_qty += d.qty;
    })

    console.log('LIST', this.listOfSelectedItems);

    this.totalCost = t_cost;
    this.totalQty = t_qty;

  }

  searchItem(d: any) {
    this.searchChange.next({data: d.target.value});
  }

  removeItem(id: string) {
    this.listOfSelectedItems = this.listOfSelectedItems.filter((r: any) => r.id !== id);
    this.getTotal();
  }

  add() {
    this.modalService
      .show({
        nzTitle: 'New Issuance'
      })
      .pipe(
        finalize(() => {}),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: res => {
          if (!res || res.status === ModalBtnStatus.Cancel) return;
          this.addEditData(res.modalValue, 'add');
        }
      });
  }

  addEditData(param: ScmIssuance, method: 'add' | 'edit'): void {
    const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId;
    if (method === 'add') {
      this.$issuance
        .add(param)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: res => {
            if (res.statusCode === 201) {
              this.msg.remove(id);
              this.msg.success('Added succesfully');
            } else {
              this.msg.remove(id);
              this.msg.error("There's an error!");
            }
          },
          error: err => {
            if (err.code === 400) {
              this.msg.remove(id);
              this.msg.error('Unsuccessfully saved');
            }
          },
          complete: () => {
            this.refresh();
          }
        });
    } else {
      this.$issuance.update(param.id, param);
    }
  }
}
