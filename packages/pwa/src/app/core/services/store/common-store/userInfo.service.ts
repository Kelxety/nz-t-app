import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';

export interface UserInfo {
  userId: number;
  authCode: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  public user_name = signal<string>('RYAN G. SANCHEZ');
  public user_photourl = signal<string>('');
  private userInfo$ = new BehaviorSubject<UserInfo>({ userId: -1, authCode: [] });

  constructor() {}

  parsToken(token: string): UserInfo {
    const helper = new JwtHelperService();
    try {
      const { rol, userId } = helper.decodeToken(token);
      return {
        userId,
        authCode: rol.split(',')
      };
    } catch (e) {
      return {
        userId: -1,
        authCode: []
      };
    }
  }

  setUserInfo(userInfo: UserInfo): void {
    this.userInfo$.next(userInfo);
  }

  setUserName(name: string): void {
    this.user_name.set(name);
  }

  setUserPhotoUrl(url: string): void {
    this.user_photourl.set(url);
  }

  getUserInfo(): Observable<UserInfo> {
    return this.userInfo$.asObservable();
  }
}
