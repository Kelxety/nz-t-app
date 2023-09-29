import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ScmReceiveDtl } from '@prisma/client';
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
  imports: [SharedModule]
})
export class ViewDetailListComponent {
  @Input() data: ScmReceiveDtl; // primary key
  @Input() actionType: string = '';
  @Output() statusData: EventEmitter<statusState> = new EventEmitter();

  readonly #modal = inject(NzModalRef);
  readonly nzData: any = inject(NZ_MODAL_DATA);

  dataModel: any = {};
  isLoading: boolean = false;

  constructor(
    private stockReceivingDtlServices: StockReceivingDtlServices,
    private msg: NzMessageService
  ) {
    this.data = this.nzData.data.id;
    this.actionType = this.nzData.actionType;


  }

  ngOnInit() {
    if (this.actionType === 'View') {

      console.log(this.data)
    }
  }

}
