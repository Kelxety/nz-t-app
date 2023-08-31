import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, pipe, throwError } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

import { TokenKey, TokenPre } from '@config/constant';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

import { LoginInOutService } from '../common/login-in-out.service';
import { WindowService } from '../common/window.service';
import { AuthService } from '../http/auth/auth.service';

interface CustomHttpConfig {
  headers?: HttpHeaders;
}

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private windowServe: WindowService, public message: NzMessageService, private loginOutService: LoginInOutService, private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<NzSafeAny>, next: HttpHandler): Observable<HttpEvent<NzSafeAny>> {
    const token = this.windowServe.getSessionStorage(TokenKey);
    let httpConfig: CustomHttpConfig = {};
    if (!!token) {
      httpConfig = { headers: req.headers.set(TokenKey, token) };
    }
    const copyReq = req.clone(httpConfig);
    // return next.handle(copyReq).pipe(
    //   filter(e => e.type !== 0),
    //   catchError(error => this.handleError(error))
    // );
    return next.handle(copyReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            return this.handleHttpResponseError(copyReq, next);
          }
        }
        return this.handleError(error);
      })
    );
  }

  private handleHttpResponseError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.windowServe.getSessionStorage(TokenKey);
    // if jwt token is not set, we just let the request execute
    if (!token) {
      return next.handle(request);
    }

    return this.authService.refresh(token).pipe(
      switchMap((newToken: string) => {
        if (newToken) {
          this.windowServe.clearSessionStorage();
          const updatedRequest = this.attachTokenToRequest(request, newToken);
          return next.handle(updatedRequest);
        } else {
          return this.handleRefreshTokenFailure();
        }
      }),
      catchError((error: any) => {
        return this.handleRefreshTokenFailure();
      })
    );
  }

  private attachTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handleRefreshTokenFailure(): Observable<HttpEvent<NzSafeAny>> {
    this.loginOutService.loginOut().then();
    throw new Error('Token refresh failed');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const status = error.status;
    let errMsg = '';
    status;
    if (status === 0) {
      errMsg = 'An unknown network error occurred, please check your network.';
    }

    if (status === 204) {
      errMsg = '204';
    }

    if (status === undefined) {
      errMsg = 'Deleted';
    }

    if (status >= 300 && status < 400) {
      errMsg = `The request was redirected by the server with a status code of ${status}`;
    }
    if (status >= 400 && status < 500) {
      errMsg = `An error occurred on the client side, it may be that the sent data is wrong, the status code is ${status}`;
      if (status === 401) {
        errMsg = `Invalid credential`;
        this.loginOutService.loginOut().then();
      }
    }
    if (status >= 500) {
      errMsg = `An error occurred on the server with status code ${status}`;
    }

    return throwError(() => {
      return {
        code: status,
        message: errMsg
      };
    });
  }
}
