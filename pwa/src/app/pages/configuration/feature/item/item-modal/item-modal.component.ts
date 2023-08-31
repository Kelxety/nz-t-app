import { Component } from '@angular/core';
import { SharedModule } from '../../../../../shared';

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.less'],
  standalone: true,
  imports: [SharedModule]
})
export class ItemModalComponent {

}
