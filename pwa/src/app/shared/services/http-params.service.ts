import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders  } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpParamsService {

  constructor() { }

  convert(options: any) {
    let params = new HttpParams();
    for (const key in options) {
      if (key === 'filter') {
        if (options[key] instanceof Object) {
          for (const f in options[key]) {
            if ((options[key][f] !== null) && (typeof options[key][f] !== 'undefined') && options[key][f] !== '') {
              if (options[key][f] instanceof Object) {
                for (const ff in options[key][f]) {
                  if ((options[key][f][ff] !== null) && (typeof options[key][f][ff] !== 'undefined') && options[key][f][ff] !== '') {
                    params = params.append(f + `[` + ff + `]`, options[key][f][ff]);
                  }
                }
              } else {
                params = params.append(f, options[key][f]);
              }
            }
          }
        }
      } else if (key === 'order') {
          options[key].forEach((element: any) => {
            params = params.append(`order[` + element?.sortColumn + `]`, element?.sortDirection);
          });
      } else {
        if ((options[key] !== null) && (typeof options[key] !== 'undefined') && options[key] !== '') {
          params = params.append(key, options[key]);
        }
      }
    }
    return params;
  }
}
