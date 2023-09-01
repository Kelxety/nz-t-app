import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from '@app/shared';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = '/api/users';

  constructor(private apiService: ApiService) {}

  me(): Observable<any> {
    const url = `${this.baseUrl}/me`;
    return this.apiService.get(url);
  }

  updateProfile(id: string, data: object) {
    const url = `${this.baseUrl}/${id}/update-profile`;
    return this.apiService.put(url, data);
  }

  changePhoto(data: any) {
    const url = `${this.baseUrl}/change-photo`;
    return this.apiService.post(url, data);
  }

  changePassword(id: string | number | null | undefined, data: object): Observable<any> {
    const url = `${this.baseUrl}/${id}/change-password`;
    return this.apiService.put(url, data);
  }
}
