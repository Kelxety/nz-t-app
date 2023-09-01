import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(filteredList: Array<any>, search:string): any {

    if (filteredList)
      return filteredList.filter((d) => (d.name).toLowerCase().indexOf(search.toLowerCase())>-1);

    return filteredList;
  }
}
