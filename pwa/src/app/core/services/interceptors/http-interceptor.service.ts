import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';

import { TokenKey } from '@config/constant';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

import { WindowService } from '../common/window.service';
import { LoginInOutService } from '../common/login-in-out.service';

interface CustomHttpConfig {
  headers?: HttpHeaders;
}

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private windowServe: WindowService, 
    public message: NzMessageService,
    private loginOutService: LoginInOutService
  ) {}

  intercept(req: HttpRequest<NzSafeAny>, next: HttpHandler): Observable<HttpEvent<NzSafeAny>> {
    const token = this.windowServe.getSessionStorage(TokenKey);
    let httpConfig: CustomHttpConfig = {};
    if (!!token) {
      httpConfig = { headers: req.headers.set(TokenKey, token) };
    }
    const copyReq = req.clone(httpConfig);
    return next.handle(copyReq).pipe(
      filter(e => e.type !== 0),
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const status = error.status;
    let errMsg = '';
    status
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
        // this.router.navigate(['/#/default/dashboard/analysis'])
        
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
