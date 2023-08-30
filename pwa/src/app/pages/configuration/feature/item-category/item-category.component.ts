import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared';

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.less'],
  standalone: true,
  imports: [SharedModule]
})
export class ItemCategoryComponent {

}
