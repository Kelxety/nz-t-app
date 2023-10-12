import { DestroyRef, inject, Injectable, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild, CanActivateChildFn } from '@angular/router';
import { Observable } from 'rxjs';

import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { fnGetUUID } from '@utils/tools';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Menu } from '../../types';
import { WindowService } from '../window.service';

// Those who are interested can look at the controversy between class and fn https://github.com/angular/angular/pull/47924
// Here I provide a different way of writing judgeLogin.guard.ts for your reference. You can also go to the official website to find the mapToCanActivate api.
// It is used to judge whether the user has permission to enter the business page when switching routes, and jump to the login page if not
@Injectable({
  providedIn: 'root'
})
export class JudgeAuthGuardService {
  authCodeArray: string[] = [];
  selMenu: Menu | null = null;
  menuNavList: Menu[] = [];
  destroyRef = inject(DestroyRef);
  retry = 0;

  constructor(
    private windowSrc: WindowService,
    private loginOutService: LoginInOutService,
    private router: Router,
    private userInfoService: UserInfoService,
    private menuStoreService: MenuStoreService,
    private message: NzMessageService
  ) {
    this.menuStoreService
      .getMenuArrayStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.menuNavList = res;
      });
  }

  // Save the current menu to this.selMenu
  getMenu(menu: Menu[], url: string): void {
    for (let i = 0; i < menu.length; i++) {
      if (url === menu[i].path) {
        this.selMenu = menu[i];
        return;
      } else {
        if (menu[i].children && menu[i].children!.length > 0) {
          this.getMenu(menu[i].children!, url);
        }
      }
    }
  }

  getResult(code: string, authCodeArray: string[]): boolean | UrlTree {
    if (authCodeArray.includes(code)) {
      return true;
    } else {
      this.message.error('You do not have permission to log in to this module!');
      this.loginOutService.loginOut();
      return this.router.parseUrl('/login');
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.userInfoService
      .getUserInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => (this.authCodeArray = res.authCode));
    while (route.firstChild) {
      route = route.firstChild;
    }
    console.log(route);
    // If there is authCode, it means that clicking the button on the page jumps to the new route, not the route in the menu
    if (!!route.data['authCode']) {
      // console.log('code route: ', route.data['authCode']);

      return this.getResult(route.data['authCode'], this.authCodeArray);
    }

    // If it is a button on the menu, go below
    if (!!this.menuNavList) {
      this.getMenu(this.menuNavList, state.url);
    }
    // No menu found, go directly to the login page

    if (!this.selMenu) {
      // console.log('key route: ', route.data['key'], this.authCodeArray);
      return this.getResult(route.data['key'], this.authCodeArray);
    }
    const selMenuCode = this.selMenu.code;
    this.selMenu = null;
    // console.log('selMenuCode: ', selMenuCode);
    // If the menu is found, but the user does not have the permission code of the menu, then jump to the login page
    return this.getResult(selMenuCode!, this.authCodeArray);
    // return true;
  }
}

export const JudgeAuthGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(JudgeAuthGuardService).canActivateChild(childRoute, state);
};
