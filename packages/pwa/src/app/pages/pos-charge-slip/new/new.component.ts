import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { SharedModule } from '@pwa/src/app/shared';
import { Subject } from 'rxjs';
import { ItemListComponent } from '../item-list/item-list.component';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.less'],
  standalone: true,
  imports: [SharedModule, ItemListComponent]
})
export class NewComponent {
  searchChange: Subject<any> = new Subject();
  itemFilter: { view: string; search: string } = {
    view: 'grid',
    search: ''
  };

  totalCost: number = 0;
  totalQty: number = 0;

  listOfSelectedItems: any[] = [];

  getTotal() {
    let t_cost: number = 0;
    let t_qty: number = 0;

    this.listOfSelectedItems.map((d: any) => {
      t_cost += d.cost * d.qty;
      t_qty += d.qty;
    });

    console.log('LIST', this.listOfSelectedItems);

    this.totalCost = t_cost;
    this.totalQty = t_qty;
  }

  getSelectedItem(event: any) {
    this.listOfSelectedItems = [{ ...event }, ...this.listOfSelectedItems];
    this.getTotal();
  }

  searchItem(d: any) {
    this.searchChange.next({ data: d.target.value });
  }

  checkout() {}
}
