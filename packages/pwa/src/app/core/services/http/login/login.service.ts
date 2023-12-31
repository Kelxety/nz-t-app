import { Inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { MENU_TOKEN } from '@config/menu';
import { Menu } from '@core/services/types';
import { Permission } from '@prisma/client';
import { ResType } from '@pwa/src/app/utils/types/return-types';
import { BaseHttpService } from '@services/base-http.service';
import { PermissionService } from '@services/system/menus.service';

export interface UserLogin {
  username: string | null;
  password: string | null;
  _channel: string | null;
  remember: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    public http: BaseHttpService,
    //@Inject(MENU_TOKEN) public menus: Menu[],
    private menuService: PermissionService
  ) {}

  public login(params: UserLogin): Observable<string> {
    return this.http.post('/api/auth/login_check', params);
  }

  public getMenuByUserId(userId: number): Observable<ResType<Array<Permission & { isOpen?: boolean; selected?: boolean }>>> {
    // If it is a static menu, release the comment below
    // return of(this.menus);
    return this.menuService.getMenuList({
      pageSize: 0,
      pagination: false
    });
  }
}
