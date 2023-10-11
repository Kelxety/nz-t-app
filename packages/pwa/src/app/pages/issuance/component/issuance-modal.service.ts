import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ModalWrapService } from '@widget/base-modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { CreateEditModalComponent } from './create-edit-modal/create-edit-modal.component';

@Injectable({
  providedIn: 'root'
})
export class IssuanceModalService {
  constructor(private modalWrapService: ModalWrapService) {}
  protected getContentComponent(): NzSafeAny {
    return CreateEditModalComponent;
  }

  public show(modalOptions: ModalOptions = {}, modalData?: string): Observable<NzSafeAny> {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, modalData);
  }
}
