import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ScmItem, ScmReceive, ScmReceiveMode, ScmSupplier, ScmWarehouse } from '@prisma/client';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { SharedModule } from '../../../shared';
import { ReceivingModeServices } from '../../configuration/Services/receving-mode/stock-receving-mode.service';
import { StockReceivingServices } from '../../configuration/Services/stock-receiving/stock-receiving.service';
import { SupplierServices } from '../../configuration/Services/supplier/supplier.service';
import { WarehouseServices } from '../../configuration/Services/warehouse/warehouse.service';
interface statusState {
  status: number;
  data: any;
}
@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.less'],
  standalone: true,
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditModalComponent {
  validateForm: UntypedFormGroup;
  @Input() data: ScmReceive; // primary key
  @Input() actionType: string = '';
  @Output() statusData: EventEmitter<statusState> = new EventEmitter();

  readonly #modal = inject(NzModalRef);
  readonly nzData: any = inject(NZ_MODAL_DATA);

  listOfOption = [
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' }
  ];

  listOfItemWarehouse: ScmWarehouse[] = [];
  listOfItemSupplier: ScmSupplier[] = [];
  listOfItemRm: ScmReceiveMode[] = [];
  listOfItem: ScmItem[] = [];

  warehouse: any = { whName: null, whAcro: null, state: 'Active' }

  supplier: any = { supplierName: null, state: 'Active' }
  newRecvMode: any = { recvMode: null, state: 'Active' }

  dataModel: any = {};
  isLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private stockReceivingServices: StockReceivingServices,
    private msg: NzMessageService,
    private cd: ChangeDetectorRef,
    private supplierServices: SupplierServices,
    private warehouseServices: WarehouseServices,
    private receivingModeServices: ReceivingModeServices,
  ) {
    this.data = this.nzData.id;
    this.actionType = this.nzData.actionType;

    this.validateForm = this.fb.group({
      rcvDate: [new Date(), [Validators.required]],
      rcvRefno: [null],
      warehouseId: [null, [Validators.required]],
      supplierId: [null, [Validators.required]],
      receivemodeId: [null, [Validators.required]],
      purchaserequestNo: [null],
      deliveryreceiptNo: [null],
      purchaseorderNo: [null],
      remarks: [null],
      state: ['Active']
    });
  }

  ngOnInit() {
    if (this.actionType === 'Edit') {
      this.getData();
    }

    const promise = [Promise.resolve(this.loadRm()), Promise.resolve(this.loadWarehouse()), Promise.resolve(this.loadSupplier())]
    Promise.all(promise)
  }

  submitForm() {
    if (this.actionType === 'Edit') {
      this.submitEdit()
    }
  }

  submitEdit() {
    if (this.validateForm.valid) {
      const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId
      this.stockReceivingServices.patch(this.data.id, this.validateForm.getRawValue()).subscribe({
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

  saveNewSupplier() {
    if (this.supplier.supplierName !== null) {
      const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId
      this.supplierServices.create(this.supplier).subscribe({
        next: (res: any) => {
          this.msg.remove(id)
          this.loadSupplier()
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

  saveNewRecvMode() {
    if (this.supplier.supplierName !== null) {
      const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId
      this.receivingModeServices.create(this.supplier).subscribe({
        next: (res: any) => {
          this.msg.remove(id)
          this.loadRm()
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
        this.loadSupplier()
        this.cd.detectChanges();
      }
    });
  }

  loadSupplier() {
    this.supplierServices.list({ pagination: false, state: 'Active' }).subscribe({
      next: (res: any) => {
        const list = res.data;
        this.listOfItemSupplier = list;
        this.isLoading = true
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false
        this.loadRm()
        this.cd.detectChanges();
      }
    });
  }

  loadRm() {
    this.receivingModeServices.list({ pagination: false, state: 'Active' }).subscribe({
      next: (res: any) => {
        const list = res.data;
        this.listOfItemRm = list;
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

  closeMe() {
    this.#modal.destroy({})
  }

  getData() {
    this.validateForm.patchValue({
      rcvDate: this.data.rcvDate,
      rcvRefno: this.data.rcvRefno,
      warehouseId: this.data.warehouseId,
      supplierId: this.data.supplierId,
      receivemodeId: this.data.receivemodeId,
      purchaserequestNo: this.data.purchaserequestNo,
      deliveryreceiptNo: this.data.deliveryreceiptNo,
      purchaseorderNo: this.data.purchaseorderNo,
      remarks: this.data.remarks,
      state: this.data.state
    })
  }

}
