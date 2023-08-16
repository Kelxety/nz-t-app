import { Injectable } from '@angular/core';
import { ApiService, HttpParamsService } from '@app/shared';
import { Observable } from 'rxjs';
import { LocationRegion } from '../model';

@Injectable({
  providedIn: 'root'
})
export class TmsRptClassService {
  public baseUrl = '/api/tms-rpt-classifications';

  constructor (
      private apiService: ApiService,
      private httpParams: HttpParamsService
  ) { }

  list(params: object = {}): Observable<LocationRegion[]> {
      const parameters = this.httpParams.convert(params);
      return this.apiService.get(this.baseUrl, parameters);
  }

  get(id: string): Observable<LocationRegion> {
      const url = `${this.baseUrl}/${id}`;
      return this.apiService.get(url);
  }

  create(data: object): Observable<LocationRegion> {
      return this.apiService.post(this.baseUrl, data);
  }

  update(id: string, data: object): Observable<LocationRegion> {
      const url = `${this.baseUrl}/${id}`;
      return this.apiService.put(url, data);
  }

  delete(id: string): Observable<any> {
      const url = `${this.baseUrl}/${id}`;
      return this.apiService.delete(url);
  }
}
