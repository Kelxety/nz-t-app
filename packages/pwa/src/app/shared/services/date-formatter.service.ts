import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {

  constructor(
    public datepipe: DatePipe
  ) { }

    format(dateEntry: Date, formatEntry: string):any {
      let temp = this.datepipe.transform(dateEntry, formatEntry);
      return temp;
    }
}
