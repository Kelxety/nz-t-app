import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// tslint:disable:no-console

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/ld+json',
      Accept: 'application/ld+json'
    });

    return this.http.get<any>(path, { params, headers }).pipe(
      tap(data => console.log('fetched data')),
      catchError(this.handleError('error', []))
    );
  }

  post(path: string, params: object = {}): Observable<any> {
    let headers = new HttpHeaders();

    if (params instanceof FormData) {
      headers = headers.append('Content-Type', 'application/ld+json');
      headers = headers.append('Accept', 'application/ld+json');
    }

    return this.http.post<any>(path, params, { headers }).pipe(
      tap((data: any) => console.log(`added`)),
      catchError(this.handleError<any>(''))
    );
  }

  put(path: string, params: object = {}): Observable<any> {
    let headers = new HttpHeaders();

    if (!(params instanceof FormData)) {
      headers = headers.append('Content-Type', 'application/ld+json');
      headers = headers.append('Accept', 'application/ld+json');
    }

    return this.http.put<any>(path, params, { headers }).pipe(
      tap((data: any) => console.log(`updated`)),
      catchError(this.handleError<any>('error'))
    );
  }

  patch(path: string, params: object = {}): Observable<any> {
    let headers = new HttpHeaders();

    if (params instanceof FormData) {
      headers = headers.append('Content-Type', 'application/ld+json');
      headers = headers.append('Accept', 'application/ld+json');
    }

    return this.http.patch<any>(path, params, { headers }).pipe(
      tap((data: any) => console.log(`updated`)),
      catchError(this.handleError<any>('error'))
    );
  }

  delete(path: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/ld+json',
      Accept: 'application/ld+json'
    });
    return this.http.delete<any>(path, { headers }).pipe(
      tap((data: any) => console.log(`deleted`)),
      catchError(this.handleError<any>('error'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error)

      // Let the app keep running by returning an empty result.
      // return of(result as T);
      return throwError(error);
      // return error;
    };
  }
}
