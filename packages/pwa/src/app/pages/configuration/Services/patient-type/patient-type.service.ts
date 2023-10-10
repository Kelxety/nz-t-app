import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HospitalPatientType, Prisma } from '@prisma/client';
import { HttpParamsService } from '@pwa/src/app/shared';
import { QueryParams, SearchParams } from '@pwa/src/app/shared/interface';
import { ApiTypeService } from '@pwa/src/app/shared/services/api-type.service';
import { ResType } from '@pwa/src/app/utils/types/return-types';
import { Observable, catchError, map, shareReplay, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HospitalPatientTypeService {
  destroyRef = inject(DestroyRef);
  http = inject(HttpClient);
  apiService = inject(ApiTypeService);
  httpParams = inject(HttpParamsService);
  refresh = signal<boolean>(true);
  errorMessage = '';
  patientType = signal<HospitalPatientType | undefined>(undefined);
  getParams = signal<SearchParams<Prisma.HospitalPatientWhereInput>>({
    pageSize: 10
  });
  selectedPatienttype = signal<HospitalPatientType | undefined>(undefined);

  public baseUrl = '/api/hospital-patient-type';

  private patientTypes$ = toObservable(this.refresh).pipe(
    switchMap(doRefresh => {
      const filteredObject = JSON.stringify(this.getParams().filteredObject);
      return this.http
        .get<ResType<HospitalPatientType[]>>(this.baseUrl, {
          params: this.getParams() ? { ...this.getParams(), filteredObject } : { pageSize: 0 }
        })
        .pipe(
          map(data => data.data.map(v => v)),

          shareReplay(1),
          catchError(this.handleError)
        );
    })
  );

  addPatientType(data: HospitalPatientType): Observable<ResType<HospitalPatientType>> {
    return this.apiService.post(this.baseUrl, data);
  }

  updatePatientType(id: string, data: object): Observable<ResType<HospitalPatientType>> {
    return this.apiService.put(`${this.baseUrl}/${id}`, data);
  }

  patientTypes = toSignal(this.patientTypes$, { initialValue: [] });

  patienTypeSelected(id: string) {
    const foundPatienttype = this.patientTypes().find(v => v.id === id);
    this.selectedPatienttype.set(foundPatienttype);
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
