import { Component, DestroyRef, TemplateRef, ViewChild, computed, inject, signal } from '@angular/core';
import { SharedModule } from '@pwa/src/app/shared';
import { HospitalPhysicianService } from '../../Services/physician/physician.service';
import { HospitalPhysician } from '@prisma/client';
import { AntTableComponent, AntTableConfig } from '../../../../shared/components/ant-table/ant-table.component';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { PhysicianModalService } from './component/physician-modal.service';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalBtnStatus } from '@pwa/src/app/widget/base-modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-physician',
  templateUrl: './physician.component.html',
  styleUrls: ['./physician.component.less'],
  standalone: true,
  imports: [SharedModule, AntTableComponent]
})
export class PhysicianComponent {
  // INJECTION
  destroyRef = inject(DestroyRef);
  $physician = inject(HospitalPhysicianService);
  private modalService = inject(PhysicianModalService);
  private msg = inject(NzMessageService);
  private msgModalService = inject(NzModalService);
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<'C'>;
  @ViewChild('stateFlag', { static: true }) stateFlag!: TemplateRef<NzSafeAny>;

  // DECLERATION
  errorMessage: string = '';
  search: string = '';
  checked: boolean = false;
  listOfCurrentPageData: readonly HospitalPhysician[] = [];
  setOfCheckedId = new Set<string>();
  tableConfig = signal<AntTableConfig>({
    headers: [],
    pageSize: 0,
    pageIndex: 0,
    total: 0,
    loading: false
  });

  physicians = computed(() => {
    try {
      return this.$physician.physicians();
    } catch (e) {
      this.errorMessage = typeof e === 'string' ? e : 'Error';
      return [];
    }
  });

  // FUNCTIONS
  refresh() {
    this.tableConfig.mutate(t => (t.loading = true));
    this.$physician.refresh.update(r => !r);
    this.tableConfig.mutate(t => (t.loading = false));
  }

  onCurrentPageDataChange($event: readonly HospitalPhysician[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
  }

  toDelete(id: string) {
    this.modalService;
    this.$physician
      .deletePhysician(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId;
          if (res.statusCode === 200) {
            this.msg.remove(id);
            this.msg.success('Deleted succesfully');
          } else {
            this.msg.remove(id);
            this.msg.error("There's an error!");
          }
          this.refresh();
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
    const physician = this.$physician.physicians().filter(p => p.id === id);
    this.modalService
      .show({
        nzTitle: 'Edit',
        nzData: {
          data: physician[0],
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

  addEditData(param: HospitalPhysician, method: 'add' | 'edit'): void {
    const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId;
    if (method === 'add') {
      this.$physician
        .addPhysician(param)
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
      this.$physician.updatePhysician(param.id, param);
    }
  }

  getUserStatus(status: 'true' | 'ACTIVE' | 'false' | 'INACTIVE'): boolean {
    if (status === 'true' || status === 'ACTIVE') return true;
    return false;
  }

  changePageSize(e: number): void {
    this.tableConfig.mutate(r => (r.pageSize = e));
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.mutate(t => (t.loading = true));
    this.$physician.getParams.mutate(p => {
      p.page = this.tableConfig().pageIndex;
      p.pageSize = this.tableConfig().pageSize;
      p.pagination = true;
      p.filteredObject = { state: 'ACTIVE' };
    });
    this.refresh();
  }

  private initTable(): void {
    this.tableConfig.mutate(tableConfig => {
      tableConfig.headers = [
        {
          title: 'Physician Name',
          field: 'physicianName',
          width: 120
        },
        {
          title: 'Designation',
          field: 'designation',
          width: 120
        },
        {
          title: 'Specialty',
          field: 'specialty',
          width: 120
        },
        {
          title: 'PRC NO',
          field: 'prcNo',
          width: 120
        },
        {
          title: 'PRC Validity',
          field: 'prcValidity',
          width: 120
        },
        {
          title: 'Status',
          field: 'state',
          width: 150,
          tdTemplate: this.stateFlag
        },
        {
          title: 'Remarks',
          field: 'remarks',
          width: 120
        },
        {
          title: 'Create Time',
          width: 100,
          field: 'createdAt',
          pipe: 'date:yyyy-MM-dd HH:mm'
        },
        {
          title: 'Updated Date',
          width: 100,
          field: 'updatedAt'
        },
        {
          title: 'Updated By',
          width: 100,
          field: 'updatedBy'
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          width: 120,
          fixed: true,
          fixedDir: 'right'
        }
      ];
      tableConfig.total = 0;
      tableConfig.loading = true;
      tableConfig.pageSize = 10;
      tableConfig.pageIndex = 1;
    });
  }

  ngOnInit(): void {
    this.initTable();
    this.getDataList();
  }
}