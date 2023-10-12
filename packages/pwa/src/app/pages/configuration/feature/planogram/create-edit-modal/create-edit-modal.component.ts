import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ScmWarehouse } from '@prisma/client';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { SharedModule } from '../../../../../shared';
import { ItemLocationServices } from '../../../Services/item-location/item-location.service';
import { WarehouseServices } from '../../../Services/warehouse/warehouse.service';
interface statusState {
  status: number;
  data: any;
}
@Component({
  selector: 'app-create-edit-modal',
  templateUrl: './create-edit-modal.component.html',
  styleUrls: ['./create-edit-modal.component.less'],
  standalone: true,
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditModalComponent {
  validateForm: UntypedFormGroup;
  @Input() data: any; // primary key
  @Input() actionType: string = '';
  @Output() statusData: EventEmitter<statusState> = new EventEmitter();

  readonly #modal = inject(NzModalRef);
  readonly nzData: any = inject(NZ_MODAL_DATA);

  warehouse: any = { whName: null, whAcro: null, state: 'Active' }
  listOfItemWarehouse: ScmWarehouse[] = [];

  listOfOption = [
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' }
  ];

  dataModel: any = {};
  isLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private itemLocationServices: ItemLocationServices,
    private msg: NzMessageService,
    private cd: ChangeDetectorRef,
    private warehouseServices: WarehouseServices
  ) {
    this.data = this.nzData.id;
    this.actionType = this.nzData.actionType;

    this.validateForm = this.fb.group({
      warehouseId: [null, [Validators.required]],
      locName: [null, [Validators.required]],
      state: ['Active']
    });
  }

  ngOnInit() {
    this.loadWarehouse()
    if (this.actionType === 'Edit') {

      this.getData();
    }
  }

  submitForm() {
    if (this.actionType === 'Create') {
      this.submitCreate()
    } else {

    }
  }

  resetForm(): void {
    // e.preventDefault();
    this.validateForm.reset();
    this.validateForm.patchValue({
      state: 'Active'
    })

    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  saveNewWh() {
    if (this.warehouse.whAcro !== null && this.warehouse.whName !== null) {
      const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId
      this.warehouseServices.create(this.warehouse).subscribe({
        next: (res: any) => {
          this.msg.remove(id)
          this.loadWarehouse()
          console.log(res.data)
        },
        error: (error: any) => {
          // console.log(error.error)
          if (error) {
            if (typeof error) {
              this.msg.error(`${error.error.error} must be unique "${error.error.message}"`)
            }
            this.msg.remove(id)
            this.msg.error('Unsuccessfully saved')
            this.cd.detectChanges()
          }
        },
        complete: () => {
          this.msg.success('Item saved successfully!');
          this.cd.detectChanges()
        }
      });
    } else {
      this.msg.error('Please fill all the inputs')
    }

  }

  loadWarehouse() {
    this.warehouseServices.list({ pagination: false, state: 'Active' }).subscribe({
      next: (res: any) => {
        const list = res.data;
        this.listOfItemWarehouse = list;
        this.isLoading = true
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false

        this.cd.detectChanges();
      }
    });
  }

  getData() {
    this.validateForm.patchValue({
      warehouseId: this.data?.warehouse.id,
      locName: this.data.locName,
      state: this.data.state
    })

  }

  submitCreate() {

    if (this.validateForm.valid) {
      const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId
      this.itemLocationServices.create(this.validateForm.getRawValue()).subscribe({
        next: (res: any) => {
          this.msg.remove(id)
          this.msg.success('Added successfully!');
          this.statusData.emit({ status: 200, data: res })
        },
        error: (error: any) => {
          if (error.code === 400) {
            this.msg.remove(id)
            this.msg.error('Unsuccessfully saved')
          }
        },
        complete: () => {
          this.resetForm();

        }
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

    }
  }


  submitEdit() {
    if (this.validateForm.valid) {
      const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId
      this.itemLocationServices.patch(this.data.id, this.validateForm.getRawValue()).subscribe({
        next: (res: any) => {
          this.msg.success('Successfully updated!');
          this.statusData.emit({ status: 200, data: res })
          this.closeMe();
        },
        error: (error: any) => {
          if (error) {
            if (typeof error) {
              this.msg.error(`${error.error.error} must be unique "${error.error.message}"`)
            }
            this.msg.remove(id)
            this.msg.error('Unsuccessfully saved')
          }
        },
        complete: () => {

          this.msg.remove(id)
        }
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

    }
  }

  closeMe() {
    this.#modal.destroy({})
  }

}
