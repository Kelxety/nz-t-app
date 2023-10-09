import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemDetailServices } from '@pwa/src/app/pages/configuration/Services/item-detail/item-detail.service';

@Component({
  selector: 'app-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.less']
})
export class ItemSelectorComponent implements OnInit {

  @Input() view: string = 'grid';
  @Input() search: string = '';
  @Input() listOfSelectedItem: any[] = [];

  @Output() newItemEvent = new EventEmitter();

  state: {
    pagination: true,
    state: 'Active',
    filter: {
      
    }
  }
  isLoading: boolean = false;
  listOfItems: any[] = [
    {
      id: 1,
      itemName: 'Atorvastatin',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Levothyroxine',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Metformin',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Lisinopril',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Amlodipine',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Atorvastatin',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Levothyroxine',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Metformin',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Lisinopril',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Amlodipine',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Atorvastatin',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Levothyroxine',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Metformin',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Lisinopril',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Amlodipine',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Atorvastatin',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Levothyroxine',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Metformin',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Lisinopril',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Amlodipine',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Atorvastatin',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Levothyroxine',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Metformin',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Lisinopril',
      qty: 100,
      price: 100,
      cost: 80
    },
    {
      id: 1,
      itemName: 'Amlodipine',
      qty: 100,
      price: 100,
      cost: 80
    }
  ];

  constructor (
    private cd: ChangeDetectorRef,
    private itemDetailServices: ItemDetailServices
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.itemDetailServices.list({}).subscribe({
      next: (res: any) => {
        this.listOfItems = res.data;
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

  addNewItem(value: any) {
    console.log('ss', value);
    this.newItemEvent.emit(value);
  }
}
