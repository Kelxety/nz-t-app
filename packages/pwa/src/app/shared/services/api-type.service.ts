import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiTypeService {
  constructor(private http: HttpClient) {}

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    let headers = new HttpHeaders();
    if (params instanceof FormData) {
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('Accept', 'application/json');
    }

    return this.http.get<T>(path, { params, headers }).pipe(
      tap(data => console.log('fetch')),
      catchError(this.handleError<T>('error'))
    );
  }

  post<T>(path: string, params: object = {}): Observable<T> {
    let headers = new HttpHeaders();
    if (params instanceof FormData) {
      headers = headers.append('Content-Type', 'application/ld+json');
      headers = headers.append('Accept', 'application/ld+json');
    }

    return this.http.post<T>(path, params, { headers }).pipe(
      tap((data: T) => console.log(`added`)),
      catchError(this.handleError<T>('error'))
    );
  }

  put<T>(path: string, params: object = {}): Observable<T> {
    let headers = new HttpHeaders();

    if (params instanceof FormData) {
      headers = headers.append('Content-Type', 'application/ld+json');
      headers = headers.append('Accept', 'application/ld+json');
    }

    return this.http.put<T>(path, JSON.stringify(params), { headers }).pipe(
      tap((data: T) => console.log(`updated`)),
      catchError(this.handleError<T>('error'))
    );
  }

  patch<T>(path: string, params: object = {}): Observable<T> {
    let headers = new HttpHeaders();
    if (params instanceof FormData) {
      headers = headers.append('Content-Type', 'application/ld+json');
      headers = headers.append('Accept', 'application/ld+json');
    }

    return this.http.patch<T>(path, params, { headers }).pipe(
      tap((data: T) => console.log(`updated`)),
      catchError(this.handleError<T>('error'))
    );
  }

  delete<T>(path: string): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/ld+json',
      Accept: 'application/ld+json'
    });
    return this.http.delete<T>(path, { headers }).pipe(
      tap((data: T) => console.log(`deleted`)),
      catchError(this.handleError<T>('error'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error);

      // Let the app keep running by returning an empty result.
      // return of(result as T);
      // eslint-disable-next-line deprecation/deprecation
      return throwError(() => new Error(error));
      // return error;
    };
  }
}
