import { Component } from '@angular/core';
import { SharedModule } from '../../../shared';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.less'],
  standalone: true,
  imports: [SharedModule]
})
export class EditModalComponent {

}
