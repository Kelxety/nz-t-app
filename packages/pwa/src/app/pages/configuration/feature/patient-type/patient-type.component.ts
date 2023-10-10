import { Component, DestroyRef, Inject, OnInit, TemplateRef, ViewChild, computed, inject, signal } from '@angular/core';
import { SharedModule } from '@pwa/src/app/shared';
import { HospitalPatientTypeService } from '../../Services/patient-type/patient-type.service';
import { HospitalPatientType, Prisma } from '@prisma/client';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateEditModalComponent } from './components/create-edit-modal/create-edit-modal.component';
import { AntTableComponent, AntTableConfig } from '@pwa/src/app/shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@pwa/src/app/shared/components/card-table-wrap/card-table-wrap.component';
import { SearchParams } from '@pwa/src/app/shared/interface';
import { PatientTypeComponentService } from './components/patient-type.service';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalBtnStatus } from '@pwa/src/app/widget/base-modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

interface Header {
  title: string;
  w?: string;
  tAlign?: 'text-center' | 'text-right' | 'text-left';
}

@Component({
  selector: 'app-patient-type',
  templateUrl: './patient-type.component.html',
  styleUrls: ['./patient-type.component.less'],
  standalone: true,
  imports: [SharedModule, AntTableComponent, CardTableWrapComponent]
})
export class PatientTypeComponent implements OnInit {
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<'C'>;
  @ViewChild('statusFlag', { static: true }) statusFlag!: TemplateRef<NzSafeAny>;
  @ViewChild('stateFlag', { static: true }) stateFlag!: TemplateRef<NzSafeAny>;
  // ColumnItem
  tableHeaders: Header[] = [{ title: 'Patient Type Name' }, { title: 'Selected' }, { title: 'State' }, { title: 'Create Time' }, { title: 'Updated Time' }, { title: 'Actions' }];
  destroyRef = inject(DestroyRef);
  $patientType = inject(HospitalPatientTypeService);
  private msg = inject(NzMessageService);
  search: string = '';
  errorMessage: string = '';
  checked = false;
  dataList = signal<HospitalPatientType[] | null>(null);
  listOfData: HospitalPatientType[] = [];
  isLoading = signal<boolean>(false);

  checkedCashArray: HospitalPatientType[] = [];
  listOfCurrentPageData: readonly HospitalPatientType[] = [];
  setOfCheckedId = new Set<string>();
  tableConfig = signal<AntTableConfig>({
    headers: [],
    pageSize: 0,
    pageIndex: 0,
    total: 0,
    loading: false
  });

  patientTypes = computed(() => {
    try {
      return this.$patientType.patientTypes();
    } catch (e) {
      this.errorMessage = typeof e === 'string' ? e : 'Error';
      return [];
    }
  });

  searchParam: SearchParams<string> = {};

  listOfSelection = [];

  constructor(private modalService: PatientTypeComponentService) {}

  onCurrentPageDataChange($event: readonly HospitalPatientType[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
  }

  selectedChecked(e: HospitalPatientType[]): void {
    this.checkedCashArray = [...e];
  }

  getUserStatus(status: 'true' | 'ACTIVE' | 'false' | 'INACTIVE'): boolean {
    if (status === 'true' || status === 'ACTIVE') return true;
    return false;
  }

  refresh() {
    this.$patientType.refresh.update(r => !r);
  }

  confirm(data: string) {
    console.log(data);
  }

  getList() {
    this.tableConfig.mutate(tableConfig => (tableConfig.loading = true));
    this.tableConfig.mutate(tableConfig => (tableConfig.loading = false));
  }

  edit(data: HospitalPatientType) {
    this.modalService
      .show({
        nzTitle: 'Edit',
        nzData: {
          data: data,
          actionType: 'Edit'
        }
      })
      .pipe(
        finalize(() => {
          // this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        if (!res || res.status === ModalBtnStatus.Cancel) {
          return;
        }
        this.addEditData(res.modalValue, 'edit');
      });
  }

  toDelete(data: HospitalPatientType) {
    console.log(data);
  }

  cancel() {
    return;
  }

  add() {
    this.modalService
      .show({ nzTitle: 'New' })
      .pipe(
        finalize(() => {}),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        if (!res || res.status === ModalBtnStatus.Cancel) {
          return;
        }
        this.addEditData(res.modalValue, 'add');
      });
  }

  addEditData(param: HospitalPatientType, method: 'add' | 'edit'): void {
    const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId;
    if (method === 'add') {
      this.$patientType
        .addPatientType(param)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: res => {
            if (res.statusCode === 201) {
              this.msg.remove(id);
              this.msg.success('Added successfully!');
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
      this.$patientType
        .updatePatientType(param.id, param)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: res => {
            if (res.statusCode === 200) {
              this.msg.remove(id);
              this.msg.success('Updated successfully');
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
    }
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.mutate(t => (t.loading = true));
    this.$patientType.getParams.mutate(p => {
      p.page = this.tableConfig().pageIndex;
      p.pageSize = this.tableConfig().pageSize;
      p.pagination = true;
    });
    this.refresh();
  }

  changePageSize(e: number): void {
    this.tableConfig.mutate(r => (r.pageSize = e));
  }

  private initTable(): void {
    this.tableConfig.mutate(tableConfig => {
      tableConfig.headers = [
        {
          title: 'Patient Type Name',
          field: 'patientTypename',
          width: 120
        },
        {
          title: 'Selected',
          width: 100,
          field: 'isPatientselect',
          tdTemplate: this.statusFlag
        },
        {
          title: 'Status',
          field: 'state',
          width: 150,
          tdTemplate: this.stateFlag
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
      tableConfig.pageIndex - 1;
    });
  }

  ngOnInit(): void {
    this.initTable();
    this.getList();
  }
}
