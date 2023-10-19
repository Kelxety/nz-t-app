import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';

import { LoginInOutService } from '../services/common/login-in-out.service';

export const authAdminGuard: CanMatchFn = (route, segments) => {
  const users = inject(LoginInOutService).currentUserSignal();
  let isTrue = false;
  if (users.role.length === 0) return isTrue;
  users.role.forEach(item => {
    if (item.role.roleName.toLowerCase() === 'superadmin') isTrue = true;
  });
  return isTrue;
};
