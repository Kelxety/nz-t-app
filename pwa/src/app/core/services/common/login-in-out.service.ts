import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';

import { AccountService, UserService } from '@app/shared/data-access/api';
import { ActionCode } from '@config/actionCode';
import { TokenKey, TokenPre } from '@config/constant';
import { SimpleReuseStrategy } from '@core/services/common/reuse-strategy';
import { TabService } from '@core/services/common/tab.service';
import { WindowService } from '@core/services/common/window.service';
import { Menu } from '@core/services/types';
import { LoginService } from '@services/login/login.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { UserInfo, UserInfoService } from '@store/common-store/userInfo.service';
import { getDeepReuseStrategyKeyFn } from '@utils/tools';
import { fnFlatDataHasParentToTree } from '@utils/treeTableTools';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../http/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginInOutService {
  private ngUnsubscribe = new Subject<void>();
  constructor(
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private tabService: TabService,
    private loginService: LoginService,
    private apiUser: UserService,
    private acctService: AccountService,
    private router: Router,
    private userInfoService: UserInfoService,
    private menuService: MenuStoreService,
    private windowServe: WindowService,
    private authService: AuthService
  ) {}

  getMenuByUserId(userId: number): Observable<Menu[]> {
    return this.loginService.getMenuByUserId(userId);
  }

  loginIn(token: string): Promise<void> {
    return new Promise(resolve => {
      this.windowServe.setSessionStorage(TokenKey, TokenPre + token);

      const data$ = this.getMe();
      const acctList$ = this.getClass();

      data$.pipe().subscribe({
        next: (o: any) => {
          console.log('USER', o);
          let id = parseInt(o.id);
          let auth: any[] = [];
          this.userInfoService.setUserName(o.accountName);
          this.userInfoService.setUserPhotoUrl(o.photoUrl);

          for (const rolePermission of o.role) {
            auth.push(rolePermission.name);
          }
          const userInfo: UserInfo = { userId: id, authCode: auth };
          userInfo.authCode.push('default:dashboard');
          userInfo.authCode.push('default:dashboard:analysis');
          console.log('USER STORED', userInfo);
          this.userInfoService.setUserInfo(userInfo);
          // this.cd.detectChanges();
          // resolve();
          this.getMenuByUserId(userInfo.userId)
            .pipe(
              finalize(() => {
                resolve();
              })
            )
            .subscribe(menus => {
              menus = menus.filter(item => {
                item.selected = false;
                item.open = false;
                return item.menuType === 'C';
              });
              const temp = fnFlatDataHasParentToTree(menus);
              this.menuService.setMenuArrayStore(temp);
              resolve();
            });
          resolve();
        },
        error: err => {
          console.log(err);
          this.msg.error('Something wrong w/ the login.');
          this.loginOut();
        },
        complete: () => {
          // this.loading = false;
        }
      });

      // acctList$.pipe().subscribe({
      //   next: (o: any) => {
      //     this.acctService.dataList = o['hydra:member'];

      //     console.log('accnt', this.acctService.dataList);
      //   },
      //   error: () => {
      //     this.loginOut();
      //     this.msg.error('Something wrong w/ the login.');
      //   },
      //   complete: () => {}
      // });

      // const userInfo: UserInfo = this.userInfoService.parsToken(TokenPre + token);
      // console.log('USER_INFO', userInfo);
      // const userInfo: UserInfo = { userId: 1, authCode: [
      //   'default:dashboard',
      //   'default:dashboard:monitor',
      //   'default:dashboard:analysis',
      //   'manage_config',
      //   'manage_event',
      //   'manage_contest',
      //   'manage_scoring',
      //   'manage_report',
      // ]};
      // // userInfo.authCode.push(ActionCode.TabsDetail);
      // // userInfo.authCode.push(ActionCode.SearchTableDetail);

      // this.userInfoService.setUserInfo(userInfo);

      // this.getMenuByUserId(userInfo.userId)
      //   .pipe(
      //     finalize(() => {
      //       resolve();
      //     })
      //   )
      //   .subscribe(menus => {
      //     menus = menus.filter(item => {
      //       item.selected = false;
      //       item.open = false;
      //       return item.menuType === 'C';
      //     });
      //     const temp = fnFlatDataHasParentToTree(menus);
      //     this.menuService.setMenuArrayStore(temp);
      //     resolve();
      //   });
      // resolve();
    });
  }

  getMe() {
    return this.apiUser.me().pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getClass() {
    return this.acctService.list({ pagination: false }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getRefreshToken(): Observable<any> {
    // const data = this.authService.refresh();
    // console.log(data);
    return of();
  }

  clearTabCash(): Promise<any> {
    return SimpleReuseStrategy.deleteAllRouteSnapshot(this.activatedRoute.snapshot).then(() => {
      return new Promise<void>(resolve => {
        // 清空tab
        this.tabService.clearTabs();
        resolve();
      });
    });
  }

  clearSessionCash(): Promise<void> {
    return new Promise(resolve => {
      this.windowServe.removeSessionStorage(TokenKey);
      this.menuService.setMenuArrayStore([]);
      resolve();
    });
  }

  loginOut(): Promise<void> {
    return this.clearTabCash()
      .then(() => {
        return this.clearSessionCash();
      })
      .then(() => {
        this.router.navigate(['/login/login-form']);
      });
  }
}
