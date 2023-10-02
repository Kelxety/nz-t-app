import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { ScmReceive } from '@prisma/client';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { SharedModule } from '../../../shared';
import { StockReceivingDtlServices } from '../../configuration/Services/stock-receving-dtl/stock-receiving-dtl.service';
interface statusState {
  status: number;
  data: any;
}

@Component({
  selector: 'app-view-detail-list',
  templateUrl: './view-detail-list.component.html',
  styleUrls: ['./view-detail-list.component.less'],
  standalone: true,
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewDetailListComponent {
  @Input() data: ScmReceive; // primary key
  @Input() actionType: string = '';
  @Output() statusData: EventEmitter<statusState> = new EventEmitter();

  readonly #modal = inject(NzModalRef);
  readonly nzData: any = inject(NZ_MODAL_DATA);
  listOfCurrentPageData: readonly any[] = [];
  dataModel: any = {};
  isLoading: boolean = false;

  model: any = {
    list: [],
    filteredList: [],
    isSubmitting: false,
    loading: true
  };


  constructor(
    private stockReceivingDtlServices: StockReceivingDtlServices,
    private msg: NzMessageService,
    private cd: ChangeDetectorRef,
  ) {
    this.data = this.nzData.data.id;
    this.actionType = this.nzData.actionType;


  }

  ngOnInit() {
    if (this.actionType === 'View') {

      console.log(this.data)
      this.loadData()
    }
  }

  onCurrentPageDataChange($event: readonly any[]): void {
    this.listOfCurrentPageData = $event;

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
    this.stockReceivingDtlServices.list({ order: order, pagination: false, filteredObject: JSON.stringify({ receiveId: this.data }) }).subscribe({
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

}
