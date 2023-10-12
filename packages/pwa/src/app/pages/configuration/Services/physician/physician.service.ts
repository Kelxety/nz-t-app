import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HospitalPhysician, Prisma } from '@prisma/client';
import { HttpParamsService } from '@pwa/src/app/shared';
import { AntTableConfig } from '@pwa/src/app/shared/components/ant-table/ant-table.component';
import { QueryParams, SearchParams } from '@pwa/src/app/shared/interface';
import { ApiTypeService } from '@pwa/src/app/shared/services/api-type.service';
import { ResType } from '@pwa/src/app/utils/types/return-types';
import { Observable, catchError, map, shareReplay, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HospitalPhysicianService {
  destroyRef = inject(DestroyRef);
  http = inject(HttpClient);
  apiService = inject(ApiTypeService);
  httpParams = inject(HttpParamsService);
  refresh = signal<boolean>(true);
  errorMessage = '';
  physician = signal<HospitalPhysician | undefined>(undefined);
  totalItems = signal<number>(0);
  getParams = signal<SearchParams<Prisma.HospitalPatientWhereInput, Prisma.HospitalOfficeOrderByWithAggregationInput>>({
    page: 1,
    pageSize: 10,
    pagination: true,
    filteredObject: {
      state: 'Active'
    }
  });
  selectedPhysician = signal<HospitalPhysician | undefined>(undefined);

  public baseUrl = '/api/hospital-physician';

  private physicians$ = toObservable(this.refresh).pipe(
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
        .get<ResType<HospitalPhysician[]>>(this.baseUrl, {
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

  addPhysician(data: HospitalPhysician): Observable<ResType<HospitalPhysician>> {
    return this.apiService.post(this.baseUrl, data);
  }

  updatePhysician(id: string, data: object): Observable<ResType<HospitalPhysician>> {
    return this.apiService.put(`${this.baseUrl}/${id}`, data);
  }

  deletePhysician(id: string): Observable<ResType<HospitalPhysician>> {
    console.log('ibis', id);
    return this.apiService.delete(`${this.baseUrl}/${id}`);
  }

  physicians = toSignal(this.physicians$, { initialValue: [] });

  physicianSelected(id: string) {
    const foundPhysician = this.physicians().find(v => v.id === id);
    this.selectedPhysician.set(foundPhysician);
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
