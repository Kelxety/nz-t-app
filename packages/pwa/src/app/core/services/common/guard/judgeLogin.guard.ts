import { assertInInjectionContext, inject, DestroyRef, Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

import { TokenKey } from '@config/constant';

import { WindowService } from '../window.service';

export const canActivateChildFn: CanActivateFn = () => {
  // This method can check whether the inject is in the context
  assertInInjectionContext(canActivateChildFn);
  const windowSrc = inject(WindowService);
  const router = inject(Router);

  const isLogin = !!windowSrc.getSessionStorage(TokenKey);
  if (isLogin) {
    return true;
  }
  return router.parseUrl('/login');
};

export const JudgeLoginGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return canActivateChildFn(childRoute, state);
};
