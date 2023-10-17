import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ModalWrapService } from '@widget/base-modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { AddItemComponent } from './add-item/add-item.component';
import { TableModalComponent } from './table-modal/table-modal.component';

@Injectable({
  providedIn: 'root'
})
export class TableModalService {

  constructor(private modalWrapService: ModalWrapService) { }

  protected getContentComponent(): NzSafeAny {
    return TableModalComponent;
  }

  protected getItemContentComponent(): NzSafeAny {
    return AddItemComponent;
  }

  public show(modalOptions: ModalOptions = {}, modalData?: any, labelConfirm?: string, confirmBtnShow?: boolean): Observable<NzSafeAny> {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, modalData, labelConfirm, confirmBtnShow);
  }

  public showItem(modalOptions: ModalOptions = {}, modalData?: any, labelConfirm?: string, confirmBtnShow?: boolean): Observable<NzSafeAny> {
    return this.modalWrapService.show(this.getItemContentComponent(), modalOptions, modalData, labelConfirm, confirmBtnShow);
  }

}
