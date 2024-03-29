import { Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserService } from '@app/shared/data-access/api';
import { TokenKey, TokenPre } from '@config/constant';
import { SimpleReuseStrategy } from '@core/services/common/reuse-strategy';
import { TabService } from '@core/services/common/tab.service';
import { WindowService } from '@core/services/common/window.service';
import { Permission, Prisma, User } from '@prisma/client';
import { ResType } from '@pwa/src/app/utils/types/return-types';
import { LoginService } from '@services/login/login.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { UserInfo, UserInfoService } from '@store/common-store/userInfo.service';
import { fnStringFlatDataHasParentToTree } from '@utils/treeTableTools';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../http/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginInOutService {
  private ngUnsubscribe = new Subject<void>();
  currentUserSignal = signal<
    Prisma.UserGetPayload<{
      include: {
        warehouse: true;
        office: true;
        role: {
          include: {
            role: {
              include: {
                permission: {
                  include: {
                    permission: true;
                  };
                };
              };
            };
          };
        };
      };
    }>
  >(null);

  constructor(
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private tabService: TabService,
    private loginService: LoginService,
    private apiUser: UserService,
    private router: Router,
    private userInfoService: UserInfoService,
    private menuService: MenuStoreService,
    private windowServe: WindowService,
    private authService: AuthService
  ) { }

  getMenuByUserId(userId: number): Observable<ResType<Array<Permission & { open?: boolean; selected?: boolean }>>> {
    return this.loginService.getMenuByUserId(userId);
  }

  loginIn(token: string): Promise<void> {
    return new Promise(resolve => {
      this.windowServe.setSessionStorage(TokenKey, TokenPre + token);

      const data$ = this.getMe();

      data$.pipe().subscribe({
        next: (o: any) => {
          let id = o.id;
          let auth: any[] = [];
          this.userInfoService.setUserName(o.accountName);
          this.userInfoService.setUserPhotoUrl(o.photoUrl);
          this.currentUserSignal.set(o);
          for (const role of o.role) {
            if (role.role.permission.length === 0) return;
            role.role.permission.forEach(menu => {
              auth.push(menu.permission.code);
            });
          }
          const userInfo: UserInfo = { userId: id, authCode: auth };
          this.userInfoService.setUserInfo(userInfo);
          this.getMenuByUserId(userInfo.userId)
            .pipe(
              finalize(() => {
                resolve();
              })
            )
            .subscribe(
              (
                menus: ResType<
                  Array<Permission & { open?: boolean; selected?: boolean }>
                >
              ) => {
                let menuData = menus.data;
                menuData = menuData.filter(
                  (
                    item: Permission & { open?: boolean; selected?: boolean }
                  ) => {
                    item.selected = false;
                    item.open = false;
                    return item.menuType === 'C';
                  }
                );
                menuData.sort((a, b) => {
                  return a.orderNum - b.orderNum;
                });
                const temp = fnStringFlatDataHasParentToTree(menuData);
                this.menuService.setMenuArrayStore(temp);
                resolve();
              }
            );
          resolve();
        },
        error: err => {
          console.log(err);
          this.msg.error('Something wrong w/ the login.');
          this.loginOut();
        },
        complete: () => {
          resolve();
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
    });
  }
  getMe(): Observable<User> {
    return this.apiUser.me().pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getRefreshToken(): Observable<any> {
    // const data = this.authService.refresh();
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
