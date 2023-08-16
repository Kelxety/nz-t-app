import { Injectable, signal } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user_name = signal<string>('');
  public user_uname = signal<string>('');
  public permissions = signal<any>([]);
  constructor() { }
}
