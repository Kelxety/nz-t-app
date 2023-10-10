import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemDetailServices } from '@pwa/src/app/pages/configuration/Services/item-detail/item-detail.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.less']
})
export class ItemSelectorComponent implements OnInit {

  @Input() view: string = 'grid';
  @Input() showCost: boolean = false;
  @Input() showPrice: boolean = false;
  @Input() search: Subject<any>;
  @Input() listOfSelectedItem: any[] = [];

  @Output() newItemEvent = new EventEmitter();

  state: {
    pagination: true,
    state: 'Active',
    filter: {
      
    }
  }
  
  isLoading: boolean = false;
  listOfItems: any[] = [];

  constructor (
    private cd: ChangeDetectorRef,
    private itemDetailServices: ItemDetailServices
  ) {}

  ngOnInit(): void {
    this.loadData('%');

    this.search.subscribe(v => { 
      this.loadData(v.data);
    });
  }

  loadData(q: string) {
    if (q === '') {
      q='%';
    }
    this.itemDetailServices.fulltextFilter({q: q}).subscribe({
      next: (res: any) => {
        this.listOfItems = res.data;
        this.defaultQty();
        console.log('ITEMS', this.listOfItems);
        this.isLoading = true
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false

        this.cd.detectChanges();
      }
    });
  }

  fun_search() {

  }

  addItem() {

  }

  defaultQty() {
    this.listOfItems.map((d:any) => {
      d.qty = 1;
    });
  }

  addNewItem(value: any) {
    console.log('ss', value);
    this.newItemEvent.emit(value);
    this.defaultQty();
  }
}
