import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, HttpParamsService } from '@app/shared';
import { ScmItem } from '@prisma/client';
import { ResType } from '@utils/types/return-types';

@Injectable({
  providedIn: 'root'
})
export class ItemServices {
  public baseUrl = '/api/item';

  constructor(private apiService: ApiService, private httpParams: HttpParamsService) {}

  list(params: object = {}): Observable<ResType<ScmItem[]>> {
    const parameters = this.httpParams.convert(params);
    return this.apiService.get(this.baseUrl, parameters);
  }

  get(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.get(url);
  }

  create(data: object): Observable<any> {
    return this.apiService.post(this.baseUrl, data);
  }

  update(id: string, data: object): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.put(url, data);
  }

  delete(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.apiService.delete(url);
  }
}
