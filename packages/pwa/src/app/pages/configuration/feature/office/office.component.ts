import { ChangeDetectorRef, Component, DestroyRef, TemplateRef, ViewChild, computed, inject, signal } from '@angular/core';
import { SharedModule } from '@pwa/src/app/shared';
import { AntTableComponent, AntTableConfig } from '@pwa/src/app/shared/components/ant-table/ant-table.component';
import { HospitalOfficeService } from '../../Services/office/office.service';
import { OfficeModalService } from './component/office-modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { HospitalOffice, Prisma } from '@prisma/client';
import { SearchParams } from '@pwa/src/app/shared/interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ModalBtnStatus } from '@pwa/src/app/widget/base-modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.less'],
  standalone: true,
  imports: [SharedModule, AntTableComponent]
})
export class OfficeComponent {
  //INJECTION
  destroyRef = inject(DestroyRef);
  $offices = inject(HospitalOfficeService);
  private readonly cdr = inject(ChangeDetectorRef);
  private modalService = inject(OfficeModalService);
  private msg = inject(NzMessageService);
  private msgModalService = inject(NzModalService);
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<'C'>;
  @ViewChild('stateFlag', { static: true }) stateFlag!: TemplateRef<NzSafeAny>;

  //DECLERATION
  errorMessage: string = '';
  search: string = '';
  checked: boolean = false;
  listOfCurrentPageData: readonly HospitalOffice[] = [];
  setOfCheckedId = new Set<string>();
  officesState = 'Active';
  params: SearchParams<Prisma.HospitalOfficeWhereInput> = {
    page: 0,
    pagination: true,
    filteredObject: {
      state: 'Active'
    }
  };

  tableConfig = signal<AntTableConfig>({
    headers: [],
    pageSize: 0,
    pageIndex: 0,
    total: 0,
    loading: true
  });

  offices = computed(() => {
    try {
      return this.$offices.offices();
    } catch (e) {
      this.errorMessage = typeof e === 'string' ? e : 'Error';
      return [];
    }
  });

  // FUNCTIONS
  refresh() {
    this.$offices.refresh.update(r => !r);
    this.tableConfig.mutate(t => (t.loading = false));
    this.cdr.detectChanges();
  }

  toDelete(id: string) {
    this.$offices
      .deleteOffice(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId;
          if (res.statusCode === 200) {
            this.msg.remove(id);
            this.msg.success('Deleted successfully');
          } else {
            this.msg.remove(id);
            this.msg.error("There's an error!");
          }
        },
        error: err => {
          if (err.code === 400) {
            this.msg.remove(id);
            this.msg.error('Error occured');
          }
        },
        complete: () => {
          this.refresh();
        }
      });
  }

  cancel() {
    return;
  }

  add() {
    this.modalService
      .show({
        nzTitle: 'New'
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

  edit(id: string) {
    const office = this.$offices.offices().filter(p => p.id === id);
    this.modalService
      .show({
        nzTitle: 'Edit',
        nzData: {
          data: office[0],
          actionType: 'Edit'
        }
      })
      .pipe(
        finalize(() => {}),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: res => {
          if (!res || res.status === ModalBtnStatus.Cancel) {
            return;
          }
          this.addEditData(res.modalValue, 'edit');
        }
      });
  }

  clickToRefresh() {
    this.getDataList();
  }

  addEditData(param: HospitalOffice, method: 'add' | 'edit'): void {
    const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId;

    if (method === 'add') {
      this.$offices
        .addOffice(param)
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
      this.$offices.updateOffice(param.id, param);
    }
  }

  getOffficeStatus(status: 'true' | 'Active' | 'false' | 'Inactive'): boolean {
    if (status === 'true' || status === 'Active') return true;
    return false;
  }

  changePageSize(e: number): void {
    this.tableConfig.mutate(t => {
      t.loading = true;
      t.pageSize = e;
    });
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.mutate(t => (t.loading = true));

    if (e?.pageIndex) {
      this.tableConfig.mutate(t => (t.pageIndex = e.pageIndex));
    }

    this.params = {
      page: e.pageIndex,
      pageSize: e.pageSize,
      pagination: true,
      filteredObject: { state: this.officesState }
    };
    this.$offices.getParams.update(p => this.params);
    this.tableConfig.mutate(t => {
      t.total = this.$offices.totalItems();
    });
    this.cdr.detectChanges();
    this.refresh();
  }

  private initTable(): void {
    this.tableConfig.mutate(t => {
      t.headers = [
        {
          title: 'Office Name',
          field: 'officeName',
          width: 120
        },
        {
          title: 'Office Acronym',
          field: 'officeAcro',
          width: 120
        },
        {
          title: 'Status',
          field: 'state',
          width: 120
        },
        {
          title: 'Remarks',
          field: 'remarks',
          width: 120
        }
      ];
    });
  }

  ngOnInit(): void {
    this.initTable();
  }
}
