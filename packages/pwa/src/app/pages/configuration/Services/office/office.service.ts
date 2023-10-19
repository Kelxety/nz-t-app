import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, map, shareReplay, switchMap, tap, throwError } from 'rxjs';

import { HospitalOffice, Prisma } from '@prisma/client';
import { HttpParamsService } from '@pwa/src/app/shared';
import { SearchParams } from '@pwa/src/app/shared/interface';
import { ApiTypeService } from '@pwa/src/app/shared/services/api-type.service';
import { ResType } from '@pwa/src/app/utils/types/return-types';

@Injectable({
  providedIn: 'root'
})
export class HospitalOfficeService {
  destroyRef = inject(DestroyRef);
  http = inject(HttpClient);
  apiService = inject(ApiTypeService);
  httpParams = inject(HttpParamsService);
  refresh = signal<boolean>(true);
  errorMessage = '';
  office = signal<HospitalOffice | undefined>(undefined);
  totalItems = signal<number>(0);
  getParams = signal<SearchParams<Prisma.HospitalOfficeWhereInput, Prisma.HospitalOfficeOrderByWithAggregationInput>>({
    page: 1,
    pageSize: 10,
    pagination: true,
    filteredObject: {
      state: 'Active'
    }
  });
  selectedOffice = signal<HospitalOffice | undefined>(undefined);

  public baseUrl = '/api/hospital-office';

  private offices$ = toObservable(this.refresh).pipe(
    switchMap(doRefresh => {
      const filteredObject = this.getParams().filteredObject ? JSON.stringify(this.getParams().filteredObject) : null;
      const orderBy = this.getParams().filteredObject ? JSON.stringify(this.getParams().orderBy) : null;
      let p: HttpParams = new HttpParams({ fromObject: { ...this.getParams(), filteredObject, orderBy } });

      if (!filteredObject) {
        p = p.delete('filteredObject');
      }

      if (!orderBy) {
        p = p.delete('orderBy');
      }

      return this.http
        .get<ResType<HospitalOffice[]>>(this.baseUrl, {
          params: p
        })
        .pipe(
          tap(t => {
            this.totalItems.set(t.totalItems);
          }),
          map(data => data.data.map(v => v)),
          shareReplay(1),
          catchError(this.handleError)
        );
    })
  );

  list(params: object = {}): Observable<ResType<HospitalOffice[]>> {
    const parameters = this.httpParams.convert(params);
    return this.apiService.get(this.baseUrl, parameters);
  }

  get(id: string): Observable<ResType<HospitalOffice>> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.get(url);
  }

  addOffice(data: HospitalOffice): Observable<ResType<HospitalOffice>> {
    return this.apiService.post(this.baseUrl, data);
  }

  updateOffice(id: string, data: object): Observable<ResType<HospitalOffice>> {
    return this.apiService.put(`${this.baseUrl}/${id}`, data);
  }

  deleteOffice(id: string): Observable<ResType<HospitalOffice>> {
    console.log('ibis', id);
    return this.apiService.delete(`${this.baseUrl}/${id}`);
  }

  offices = toSignal(this.offices$, { initialValue: [] });

  officeSelected(id: string): void {
    const foundOffice = this.offices().find(v => v.id === id);
    this.selectedOffice.set(foundOffice);
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
