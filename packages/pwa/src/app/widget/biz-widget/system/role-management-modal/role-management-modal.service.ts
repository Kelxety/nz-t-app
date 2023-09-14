import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Role } from '@prisma/client';
import { ModalWrapService } from '@widget/base-modal';
import { RoleManageModalComponent } from '@widget/biz-widget/system/role-manage-modal/role-manage-modal.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { RoleService } from '@pwa/src/app/core/services/http/system/role.service';

@Injectable({
  providedIn: 'root'
})
export class RoleManagementModalService {
  constructor(private roleService: RoleService) {}
}
