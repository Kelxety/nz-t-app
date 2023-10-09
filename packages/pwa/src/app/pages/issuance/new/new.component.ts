import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { SharedModule } from '@pwa/src/app/shared';

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
    this.listOfSelectedItems = [{...event},...this.listOfSelectedItems]
  }
}
