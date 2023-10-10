import { Injectable } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { ModalWrapService } from '../../../widget/base-modal';
import { ItemInquiryModalComponent } from './item-inquiry-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ItemInquiryModalService {

  constructor(private modalWrapService: ModalWrapService) { }

  protected getContentComponent(): NzSafeAny {
    return ItemInquiryModalComponent;
  }

  public show(modalOptions: ModalOptions = {}, modalData?: any): Observable<NzSafeAny> {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, modalData);
  }
}
