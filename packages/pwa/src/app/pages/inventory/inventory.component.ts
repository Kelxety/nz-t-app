import { ChangeDetectorRef, Component } from '@angular/core';
import { SharedModule } from '../../shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InventorySignals } from './inventory.signal';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.less'],
  standalone: true,
  imports: [
    SharedModule
  ]
})
export class InventoryComponent {

  constructor (
    private cd: ChangeDetectorRef,
    private msg: NzMessageService,
    public signals: InventorySignals
  ){ }

  onQueryParamsChange(e: any) {

  }

  search(e: any) {

  }



}
