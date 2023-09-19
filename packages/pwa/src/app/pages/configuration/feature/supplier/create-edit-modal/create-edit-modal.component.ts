import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ScmSupplier } from '@prisma/client';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { SharedModule } from '../../../../../shared';
import { SupplierServices } from '../../../Services/supplier/supplier.service';

interface statusState {
  status: number;
  data: any;
}
@Component({
  selector: 'app-create-edit-modal',
  templateUrl: './create-edit-modal.component.html',
  styleUrls: ['./create-edit-modal.component.less'],
  standalone: true,
  imports: [SharedModule]
})
export class CreateEditModalComponent {
  validateForm: UntypedFormGroup;
  @Input() data: ScmSupplier; // primary key
  @Input() actionType: string = '';
  @Output() statusData: EventEmitter<statusState> = new EventEmitter();

  readonly #modal = inject(NzModalRef);
  readonly nzData: any = inject(NZ_MODAL_DATA);

  listOfOption = [
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' }
  ];

  dataModel: any = {};
  isLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private supplierServices: SupplierServices,
    private msg: NzMessageService
  ) {
    this.data = this.nzData.id;
    this.actionType = this.nzData.actionType;

    this.validateForm = this.fb.group({
      supplierName: ['', [Validators.required]],
      supplierAddress: ['', [Validators.required]],
      contactPerson: [null],
      contactNo: [''],
      remarks: [null],
      state: ['Active']
    });
  }

  ngOnInit() {
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

  getData() {
    this.validateForm.patchValue({
      supplierName: this.data?.supplierName,
      supplierAddress: this.data.supplierAddress,
      contactPerson: this.data.contactPerson,
      contactNo: this.data.contactNo,
      remarks: this.data.remarks,
      state: this.data.state
    })

  }

  submitCreate() {

    if (this.validateForm.valid) {
      const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId
      this.validateForm.get('contactNo').setValue(parseInt(this.validateForm.get('contactNo').value))
      this.supplierServices.create(this.validateForm.getRawValue()).subscribe({
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
      this.supplierServices.patch(this.data.id, this.validateForm.getRawValue()).subscribe({
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
