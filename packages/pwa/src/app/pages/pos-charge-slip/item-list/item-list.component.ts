import { Component } from '@angular/core';
import { SharedModule } from '@pwa/src/app/shared';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.less'],
  standalone: true,
  imports: [SharedModule]
})
export class ItemListComponent {
  view: 'grid' | 'list' = 'grid';
  title: string = 'Hello';
  listOfItems = [];
  showPrice: true;
  showCost: true;
  isLoading: true;
  addNewItem(row) {}
}
