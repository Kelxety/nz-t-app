import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const excludePaths = [
      '/api/auth/login_check',
      '/api/users/me',
      '/api/auth/refresh',
    ];
    const isExcludedPath = (path: string) => {
      return excludePaths.includes(path);
    };
    const request = context.switchToHttp().getRequest();
    const requestPath = request.url;
    if (isExcludedPath(requestPath)) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: data.message,
        data: data.data,
        totalItems: data.totalItems,
      })),
    );
  }
}
