import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, share } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RolePermission {}
