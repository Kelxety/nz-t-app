import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MENU_TOKEN } from '@app/config/menu';

import { Menu } from '../../types';
import { BaseHttpService } from '../base-http.service';
import { UserLogin } from '../login/login.service';
import { MenusService } from '../system/menus.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public http: BaseHttpService, @Inject(MENU_TOKEN) public menus: Menu[], private menuService: MenusService) {}
  public login(params: UserLogin): Observable<string> {
    return this.http.post('/api/auth/login_check', params);
  }

  public getMenuByUserId(userId: number): Observable<Menu[]> {
    // If it is a static menu, release the comment below
    return of(this.menus);
    // return this.http.get(`/sysPermission/menu/${userId}`);
  }

  public refresh(token: string): Observable<any> {
    const data = this.http.post('/api/auth/refresh', { token: token });
    return data;
  }
}
