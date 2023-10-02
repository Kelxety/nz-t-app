import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MenuModalComponent } from '@pwa/src/app/widget/biz-widget/system/permission-modal/permission-modal.component';
import { MenuListObj } from '@services/system/menus.service';
import { ModalWrapService } from '@widget/base-modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class MenuModalService {
  constructor(private modalWrapService: ModalWrapService) {}
  protected getContentComponent(): NzSafeAny {
    return MenuModalComponent;
  }

  public show(modalOptions: ModalOptions = {}, modalData?: MenuListObj): Observable<NzSafeAny> {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, modalData);
  }
}
