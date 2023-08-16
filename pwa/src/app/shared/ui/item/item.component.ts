import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';

interface item {
  name: string;
  value: string;
  active: boolean;
}

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnInit {
  @Input() list: any = [];
  @Input() id: string = '';
  @Input() title: string = '';
  @Input() loading?: boolean = false;
  @Input() clickable: boolean = false;
  @Input() disableAdd: boolean = true;
  @Input() canAdd: boolean = false;

  @Output() reload = new EventEmitter();
  @Output() add = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() submit = new EventEmitter();
  @Output() clickItem = new EventEmitter();

  search: string = '';
  filteredList: item[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private msg: NzMessageService
  ) {};

  ngOnInit() {
    this.cd.detectChanges();
  }

  click(d: item) {
    let tempList: item[] = [];
    this.list.map((x: item) => {
      let a:item = x;
      if (x.value === d.value) {
        a.active = true;
        this.clickItem.emit(d);
      } else {
        a.active = false;
      }
      tempList.push(a);
    })

    this.list = tempList;

    this.cd.detectChanges();
  }

  addItem() {
    this.add.emit({});
  }

  editItem(d: any) {
    console.log('XXXXXX', d);
    this.edit.emit(d)
  }

  reloading() {
    this.reload.emit({})
  }


  cancel(): void {
    // this.nzMessageService.info('click cancel');
  }

  confirm(data: any): void {
    this.delete.emit(data);
    this.reloading();
  }

  beforeConfirm(): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 300);
    });
  }
}


