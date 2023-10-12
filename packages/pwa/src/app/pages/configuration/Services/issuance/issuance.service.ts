import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ScmIssuance, Prisma } from '@prisma/client';
import { HttpParamsService } from '@pwa/src/app/shared';
import { QueryParams, SearchParams } from '@pwa/src/app/shared/interface';
import { ApiTypeService } from '@pwa/src/app/shared/services/api-type.service';
import { ResType } from '@pwa/src/app/utils/types/return-types';
import { Observable, catchError, map, shareReplay, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssuanceService {
  destroyRef = inject(DestroyRef);
  http = inject(HttpClient);
  apiService = inject(ApiTypeService);
  httpParams = inject(HttpParamsService);
  refresh = signal<boolean>(true);
  errorMessage = '';
  data = signal<ScmIssuance | undefined>(undefined);
  getParams = signal<SearchParams<Prisma.ScmIssuanceWhereInput, Prisma.ScmIssuanceOrderByWithAggregationInput>>({
    pageSize: 10
  });
  selectedData = signal<ScmIssuance | undefined>(undefined);

  public baseUrl = '/api/issuance';

  private data$ = toObservable(this.refresh).pipe(
    switchMap(doRefresh => {
      const filteredObject = this.getParams().filteredObject ? JSON.stringify(this.getParams().filteredObject) : null;
      const orderBy = this.getParams().orderBy ? JSON.stringify(this.getParams().orderBy) : null;

      let p: HttpParams = new HttpParams({ fromObject: { ...this.getParams(), filteredObject, orderBy } });

      if (!filteredObject) {
        p = p.delete('filteredObject');
      }

      if (!orderBy) {
        p = p.delete('orderBy');
      }

      return this.http
        .get<ResType<ScmIssuance[]>>(this.baseUrl, {
          params: p
        })
        .pipe(
          map(data => data.data.map(v => v)),

          shareReplay(1),
          catchError(this.handleError)
        );
    })
  );

  list(params: object = {}): Observable<ResType<ScmIssuance[]>> {
    const parameters = this.httpParams.convert(params);
    return this.apiService.get(this.baseUrl, parameters);
  }

  get(id: string): Observable<ResType<ScmIssuance>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.get(url);
  }

  add(data: ScmIssuance): Observable<ResType<ScmIssuance>> {
    return this.apiService.post(this.baseUrl, data);
  }

  update(id: string, data: object): Observable<ResType<ScmIssuance>> {
    return this.apiService.put(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<ResType<ScmIssuance>> {
    console.log('ibis', id);
    return this.apiService.delete(`${this.baseUrl}/${id}`);
  }

  datas = toSignal(this.data$, { initialValue: [] });

  selected(id: string) {
    const foundData = this.datas().find(v => v.id === id);
    this.selectedData.set(foundData);
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
