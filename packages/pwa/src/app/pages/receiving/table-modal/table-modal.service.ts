import { Injectable } from '@angular/core';
import { User } from '@prisma/client';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { ModalWrapService } from '../../../widget/base-modal';
import { TableModalComponent } from './table-modal.component';

@Injectable({
  providedIn: 'root'
})
export class TableModalService {

  constructor(private modalWrapService: ModalWrapService) { }

  protected getContentComponent(): NzSafeAny {
    return TableModalComponent;
  }

  public show(modalOptions: ModalOptions = {}, modalData?: User): Observable<NzSafeAny> {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, modalData);
  }

}
