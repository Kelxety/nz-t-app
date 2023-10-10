import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedModule } from '@pwa/src/app/shared';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.less'],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class NewComponent implements OnInit {

  searchChange: Subject<any> = new Subject();
  totalCost: number = 0;
  totalQty: number = 0;

  ngOnInit(): void {
    
  }

  itemFilter: any = {
    view: 'grid', //  grid, list
    search: '',
  }

  listOfWarehouse: any[] = [];
  listOfOffice: any[] = [];
  listOfSelectedItems: any[] = [];

  isSubmitting: boolean = false;
  constructor() {
    this.listOfSelectedItems = [];
  }

  resetData() {
    this.listOfSelectedItems = [];
  }

  getSelectedItem(event: any) {
    this.listOfSelectedItems = [{...event},...this.listOfSelectedItems];
    this.getTotal();
  }

  getTotal() {
    let t_cost: number = 0;
    let t_qty: number = 0;

    this.listOfSelectedItems.map((d:any) => {
      t_cost += d.cost * d.qty;
      t_qty += d.qty;
    })

    console.log('LIST', this.listOfSelectedItems);

    this.totalCost = t_cost;
    this.totalQty = t_qty;

  }

  searchItem(d: any) {
    this.searchChange.next({data: d.target.value});
  }

  removeItem(id: string) {
    this.listOfSelectedItems = this.listOfSelectedItems.filter((r: any) => r.id !== id);
    this.getTotal();
  }
}
