import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SharedModule } from '@pwa/src/app/shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { InventorySignals } from '../inventory.signal';

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
  validateForm: UntypedFormGroup;

  readonly #modal = inject(NzModalRef);
  readonly nzData: any = inject(NZ_MODAL_DATA);

  listOfOption = [
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'Inactive' }
  ];

  dataModel: any = {};
  isLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private msg: NzMessageService,
    private cd: ChangeDetectorRef,
    public signals: InventorySignals
  ) {
    this.validateForm = this.fb.group({
      warehouseId: [null, [Validators.required]],
      locName: [null, [Validators.required]],
      state: ['Active']
    });
  }


  onQueryParamsChange(e: any) {

  }
}
