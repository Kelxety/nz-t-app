import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ModalBtnStatus } from '@widget/base-modal';
import { AppendFormModalService } from '@widget/biz-widget/form/append-form-modal/append-form-modal.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

/*
 * 任务对象
 * */
export interface TaskObj {
  id: number;
  taskName: string;
  taskDesc: string;
  taskEvaluate: null;
  equipmentId: number;
  equipmentName: string;
  systemName: string;
  systemId: number;
  taskState: number;
  userName: string;
  taskStateName: string;
  taskUserId: string | string[];
  checkPeriod: string;
  createTime: number;
  updateTime: number;
  endTime: number;
  startTime: number;
  finishRate: number;
}

// 任务搜索条件
export enum TaskStateSearchEnum {
  NoStarted,
  Processing,
  Complete,
  Overdue,
  All
}

// 任务搜索条件
export enum TaskStateSearchCheckPeriodEnum {
  DayCheck,
  MonthCheck,
  QuarterlyCheck,
  YearCheck,
  All
}

@Component({
  selector: 'app-append-form',
  templateUrl: './append-form.component.html',
  styleUrls: ['./append-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageHeaderComponent,
    NzCardModule,
    NzGridModule,
    NzTypographyModule,
    NzDividerModule,
    NzRadioModule,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzWaveModule,
    NzIconModule,
    NzListModule,
    NzDropDownModule,
    NzMenuModule,
    NzTagModule,
    NzProgressModule,
    NzPaginationModule,
    DatePipe,
    NzFormModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ]
})
export class AppendFormComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '表单增删示例',
    breadcrumb: ['Front page', '组件', 'Form', '表单增删'],
    desc: '表单增删示例'
  };
  taskStateSearchEnum = TaskStateSearchEnum;
  taskState = TaskStateSearchEnum.All;
  taskCheckPeriodState = TaskStateSearchCheckPeriodEnum.All;
  pageObj = {
    pageSize: 3,
    pageNum: 1
  };
  showTaskList: TaskObj[] = [];
  showAllTaskList: TaskObj[] = [
    {
      id: 1,
      taskName: '一个任务',
      taskDesc: '一个任务',
      taskEvaluate: null,
      equipmentId: 1,
      equipmentName: '一个任务',
      systemName: '一个任务',
      systemId: 1,
      taskState: 1,
      userName: '小华',
      taskStateName: '一个任务',
      taskUserId: '一个任务',
      checkPeriod: '一个任务',
      createTime: 1,
      updateTime: 1,
      endTime: 1,
      startTime: 1,
      finishRate: 1
    },
    {
      id: 2,
      taskName: '一个任务',
      taskDesc: '一个任务',
      taskEvaluate: null,
      equipmentId: 1,
      equipmentName: '一个任务',
      systemName: '一个任务',
      systemId: 1,
      taskState: 1,
      userName: '小张',
      taskStateName: '一个任务',
      taskUserId: '一个任务',
      checkPeriod: '一个任务',
      createTime: 1,
      updateTime: 1,
      endTime: 1,
      startTime: 1,
      finishRate: 1
    },
    {
      id: 1,
      taskName: '一个任务',
      taskDesc: '一个任务',
      taskEvaluate: null,
      equipmentId: 1,
      equipmentName: '一个任务',
      systemName: '一个任务',
      systemId: 1,
      taskState: 1,
      userName: '小林',
      taskStateName: '一个任务',
      taskUserId: '一个任务',
      checkPeriod: '一个任务',
      createTime: 1,
      updateTime: 1,
      endTime: 1,
      startTime: 1,
      finishRate: 1
    },
    {
      id: 1,
      taskName: '一个任务',
      taskDesc: '一个任务',
      taskEvaluate: null,
      equipmentId: 1,
      equipmentName: '一个任务',
      systemName: '一个任务',
      systemId: 1,
      taskState: 1,
      userName: '小子',
      taskStateName: '一个任务',
      taskUserId: '一个任务',
      checkPeriod: '一个任务',
      createTime: 1,
      updateTime: 1,
      endTime: 1,
      startTime: 1,
      finishRate: 1
    }
  ];
  taskCheckPeriodStateEnum = TaskStateSearchCheckPeriodEnum;
  loading = false;

  validateForm = this.fb.group({
    formArray: this.fb.array([this.creatForm()])
  });

  get valuesArray(): FormArray {
    return this.validateForm.controls['formArray'] as FormArray;
  }
  constructor(private modalService: AppendFormModalService, private cdr: ChangeDetectorRef, private fb: FormBuilder) {}

  creatForm(): FormGroup {
    return this.fb.group({
      detail: [null]
    });
  }

  del(groupIndex: number): void {
    this.valuesArray.removeAt(groupIndex);
  }
  addForm(): void {
    this.valuesArray.push(this.creatForm());
  }

  pageSizeChange(event: number): void {
    this.pageObj = { ...this.pageObj, pageSize: event };
    this.getData(1);
  }

  searchTask(event: number, type: 'checkPeriod' | 'taskState'): void {
    this.pageObj = { ...this.pageObj, pageNum: 1 };

    this.showAllTaskList = this.showAllTaskList.filter(item => {
      return true;
    });

    this.pageSizeChange(this.pageObj.pageSize);
  }

  add(): void {
    this.modalService
      .show({ nzTitle: '新增' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ modalValue, status }) => {
        if (status === ModalBtnStatus.Cancel) {
          return;
        }
        this.showAllTaskList.push(modalValue);
        this.getData(1);
        console.log(modalValue);
      });
  }

  onEllipsisChange(ellipsis: boolean): void {
    // console.log(ellipsis);
  }

  // 分页获取数据
  getData(event: number = this.pageObj.pageNum): void {
    this.pageObj = { ...this.pageObj, pageNum: event };
    this.showTaskList = [...this.showAllTaskList.slice((this.pageObj.pageNum - 1) * this.pageObj.pageSize, this.pageObj.pageNum * this.pageObj.pageSize)];
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.getData(1);
  }
}
