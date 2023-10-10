import { Component } from '@angular/core';
import { SharedModule } from '@pwa/src/app/shared';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
  standalone: true,
  imports: [
    SharedModule
  ]
})
export class ListComponent {

}
