import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemDetailServices } from '@pwa/src/app/pages/configuration/Services/item-detail/item-detail.service';
import e from 'express';
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
        this.getCountSelected();
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

  getCountSelected() {
    this.listOfItems.map((d:any) => {
      const count = this.listOfSelectedItem.filter((r: any) => r.id !== d.id);
      if (count.length > 0) { d.selectedQty = count[0].qty; } else {d.selectedQty = 0;}
    })
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
    this.getCountSelected();
    this.cd.detectChanges();
  }
}
