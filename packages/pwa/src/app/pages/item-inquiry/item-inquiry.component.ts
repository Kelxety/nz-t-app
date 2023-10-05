import { ChangeDetectorRef, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { SharedModule } from '../../shared';
import { ItemServices } from '../configuration/Services/item/item.service';
@Component({
  selector: 'app-item-inquiry',
  templateUrl: './item-inquiry.component.html',
  styleUrls: ['./item-inquiry.component.less'],
  standalone: true,
  imports: [SharedModule, NzSegmentedModule]
})
export class ItemInquiryComponent {
  isSpinning = false;
  results: any[];
  @ViewChild('searchInput') searchInput: ElementRef;
  search: string = '';
  itemCardData = signal<any>([])

  gridList = [
    { label: 'Grid', value: 'Grid', icon: 'appstore' },
    { label: 'List', value: 'List', icon: 'bars' },

  ];

  constructor(
    private cd: ChangeDetectorRef,
    private itemServices: ItemServices
  ) {

  }

  ngOnInit(): void {
    this.loadData();


  }

  loadData() {
    this.isSpinning = true

    let order: any = [
      {
        sortColumn: 'itemCode',
        sortDirection: 'asc'
      }
    ];
    this.itemServices.list({ order: order, pagination: false }).subscribe({
      next: (res: any) => {
        console.log(res.data)
        // const list = res.data
        this.itemCardData.set(res.data)
        // model.list = list;
        // model.filteredList = list;
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        this.isSpinning = false
        // model.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  onSearch() {
    this.isSpinning = true
    // let model: any = this.model;
    // model.loading = true;
    // this.model.filteredList = this.model.list.filter((d: any) => d.rcvRefno.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
    // console.log('S', this.search);
    this.itemServices.fulltextFilter({ q: this.search }).subscribe({
      next: (value) => {
        console.log(value)
        this.itemCardData.set(value.data)
        // const list = value.data

        // model.list = list;
        // model.filteredList = list;
      },
      error: (err) => {

      }, complete: () => {
        this.isSpinning = false
        // model.loading = false;
        this.cd.detectChanges();
      },
    })
    this.cd.detectChanges();
  }

  onClick(data: any) {
    console.log(data)
  }

  onClear() {
    this.search = null
    this.loadData()
  }
}
