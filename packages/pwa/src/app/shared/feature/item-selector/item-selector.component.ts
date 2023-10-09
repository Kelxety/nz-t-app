import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.less']
})
export class ItemSelectorComponent {

  @Input() view: string = 'grid';
  @Input() search: string = '';
  @Input() listOfSelectedItem: any[] = [];

  @Output() newItemEvent = new EventEmitter();

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

  addItem() {

  }

  addNewItem(value: any) {
    console.log('ss', value);
    this.newItemEvent.emit(value);
  }
}
