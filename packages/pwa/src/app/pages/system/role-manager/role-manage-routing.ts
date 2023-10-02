import { Route } from '@angular/router';

import { ActionCode } from '@config/actionCode';

import { RoleManageComponent } from './role-manage.component';
import { SetRoleComponent } from './set-role/set-role.component';

export default [
  {
    path: '',
    component: RoleManageComponent,
    data: { title: 'role management', key: 'role-manage' }
  },
  {
    path: 'set-role',
    component: SetRoleComponent,
    data: {
      title: 'role management',
      key: 'set-role',
      authCode: ActionCode.RoleManagerSetRole
    }
  }
] as Route[];
