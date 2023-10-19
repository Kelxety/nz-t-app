import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Prisma, ScmItem, ScmItemLocation, ScmWarehouse } from '@prisma/client';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { Observable, of } from 'rxjs';
import { SharedModule } from '../../../../shared';
import { SearchParams } from '../../../../shared/interface';
import { fnCheckForm } from '../../../../utils/tools';
import { ItemLocationServices } from '../../../configuration/Services/item-location/item-location.service';
import { ItemServices } from '../../../configuration/Services/item/item.service';
import { UnitServices } from '../../../configuration/Services/unit/unit.service';
import { WarehouseServices } from '../../../configuration/Services/warehouse/warehouse.service';
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.less'],
  standalone: true,
  imports: [FormsModule, NzFormModule, ReactiveFormsModule, NzGridModule, NzInputModule, NgIf, NzRadioModule, NzSwitchModule, NzTreeSelectModule, NzSelectModule, NgFor, SharedModule]
})
export class AddItemComponent {
  unitServices = inject(UnitServices);
  warehouseServices = inject(WarehouseServices)
  itemLocationServices = inject(ItemLocationServices)
  itemServices = inject(ItemServices)

  msg = inject(NzMessageService)
  cd = inject(ChangeDetectorRef)
  private modalRef = inject(NzModalRef);
  readonly nzModalData: any = inject(NZ_MODAL_DATA);
  private fb = inject(FormBuilder);
  validateFormDetail!: UntypedFormGroup;
  addEditForm!: FormGroup;
  isEdit = signal<boolean>(false);
  value?: string;

  isLoading = false;
  isVisible = false;
  duplicated = false
  newDataGroup = false
  destroyRef = inject(DestroyRef);

  optionListWarehouse: any;
  optionList: any

  listOfItemWarehouse: ScmWarehouse[] = [];
  listOfItemLocation: ScmItemLocation[] = [];
  listOfItem: ScmItem[] = [];

  warehouse: any = { whName: null, whAcro: null, state: 'Active' }
  location: any = { warehouseId: null, locName: null, state: 'Active' }

  itemDataList = signal<any>([])
  totalCost = signal<number>(0)
  totalCostAmount = signal<number>(0)

  ngOnInit(): void {
    // this.loadAccount()
    this.itemDataList.set(this.nzModalData)
    const promise = [Promise.resolve(this.loadUnitData()),
    Promise.resolve(this.loadWarehouse()),
    Promise.resolve(this.loadLocationData()),
    Promise.resolve(this.loadItems())]
    Promise.all(promise)

    // this.validateFormDetail.disable()
    this.validateFormDetail = this.fb.group({
      selectedItem: [null, [Validators.required]],
      receiveId: [null],
      itemdtlId: [null],
      locationId: [null, [Validators.required]],
      qty: [0, [Validators.required]],
      cost: [0, [Validators.required]],
      brandName: [null],
      costAmount: [0],
      subitemCode: [null],
      barcodeNo: [null],
      subitemName: [null, [Validators.required]],
      unitId: [null, [Validators.required]],
      lotNo: [null, [Validators.required]],
      batchNo: [null],
      expirationDate: [null],
      price: [0],
      markup: [0],
      state: ['Active'],
    });
    this.setupFormChangeListeners();
  }

  loadUnitData() {
    this.unitServices.list({ pagination: false, state: 'Active' }).subscribe({
      next: (res: any) => {
        const list = res.data;
        this.optionList = list;
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

  loadLocationData() {
    this.itemLocationServices.list({ pagination: false, filteredObject: {state: 'Active'} }).subscribe({
      next: (res: any) => {
        const list = res.data;
        this.listOfItemLocation = list;
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

  loadItems() {
    const params: SearchParams<Prisma.ScmItemWhereInput, Prisma.ScmItemOrderByWithAggregationInput> = {
      filteredObject: { state: 'Active' },
      orderBy: {
        itemCode: 'asc'

      },
      pagination: false
    };
    this.itemServices.list(params).subscribe({
      next: (res: any) => {
        const list = res.data;
        this.listOfItem = list;
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

  saveNewLoc() {
    if (this.location.warehouseId !== null && this.location.locName !== null) {
      const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId
      this.itemLocationServices.create(this.location).subscribe({
        next: (res: any) => {
          this.msg.remove(id)
          this.loadLocationData()
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

  protected getAsyncFnData(modalValue: NzSafeAny): Observable<NzSafeAny> {
    return of(modalValue);
  }

  protected getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.validateFormDetail)) {
      return of(false);
    } else {
      this.addItem()
      return of(this.itemDataList());
    }

  }

  private setupFormChangeListeners() {
    this.validateFormDetail.get('selectedItem').valueChanges.subscribe((res) => this.patchSubItemName(res.itemName))
    this.validateFormDetail.get('cost').valueChanges.subscribe(() => {
      this.computePriceOrMarkup();
    });

    this.validateFormDetail.get('price').valueChanges.subscribe(() => {
      this.computeMarkupFromPrice();
    });

    this.validateFormDetail.get('markup').valueChanges.subscribe(() => {
      this.computePriceFromMarkup();
    });

    this.validateFormDetail.get('qty').valueChanges.subscribe(() => {
      this.computeCostFromQuantity()
    })

  }

  private patchSubItemName(data: any) {
    this.validateFormDetail.get('subitemName').setValue(data, { emitEvent: false })
  }


  private computePriceOrMarkup() {
    const cost = this.validateFormDetail.get('cost').value;
    const markup = this.validateFormDetail.get('markup').value;
    const qty = this.validateFormDetail.get('qty').value;

    if (cost !== null && markup !== null) {
      const price = this.roundToTwoDecimals(cost + cost * (markup / 100));
      this.totalCost.set(this.roundToTwoDecimals(cost * qty))
      this.validateFormDetail.get('costAmount').setValue(this.totalCost(), { emitEvent: false });
      this.validateFormDetail.get('price').setValue(price, { emitEvent: false });
    } else {
      this.totalCost.set(0)
      this.validateFormDetail.get('price').setValue(0, { emitEvent: false });
    }
  }

  private computeCostFromQuantity() {
    const cost = this.validateFormDetail.get('cost').value;
    const qty = this.validateFormDetail.get('qty').value;

    if (cost !== null && qty !== null) {
      // const price = this.roundToTwoDecimals(cost + cost * (markup / 100));
      this.totalCost.set(this.roundToTwoDecimals(cost * qty))
      this.validateFormDetail.get('costAmount').setValue(this.totalCost(), { emitEvent: false });
    } else {
      this.totalCost.set(0)
      this.validateFormDetail.get('costAmount').setValue(0, { emitEvent: false });
    }
  }

  private computePriceFromMarkup() {
    const cost = this.validateFormDetail.get('cost').value;
    const markup = this.validateFormDetail.get('markup').value;

    if (cost !== null && markup !== null) {
      const price = this.roundToTwoDecimals(cost + cost * (markup / 100));
      this.validateFormDetail.get('price').setValue(price, { emitEvent: false });
    } else {
      this.validateFormDetail.get('price').setValue(0, { emitEvent: false });
    }
  }

  private computeMarkupFromPrice() {
    const cost = this.validateFormDetail.get('cost').value;
    const price = this.validateFormDetail.get('price').value;

    if (cost !== null && price !== null) {
      const computedMarkup = ((price - cost) / cost) * 100;
      const markup = this.roundToTwoDecimals(computedMarkup);
      this.validateFormDetail.get('markup').setValue(markup, { emitEvent: false });
    } else {
      this.validateFormDetail.get('markup').setValue(0, { emitEvent: false });
    }
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100; // Round to two decimal places
  }

  footerTotalCost() {
    let totalCost = 0
    this.itemDataList.mutate(data => {

      totalCost = data.reduce((accumulator, item) => {
        for (const itemDetail of item.itemDetails) {
          accumulator += itemDetail.costAmount || 0;
        }
        return accumulator;
      }, 0);
      console.log(totalCost)
      this.totalCostAmount.set(totalCost)
      return this.itemDataList()
    })

  }


  addItem() {
    if (this.validateFormDetail.valid) {
      this.itemDataList.mutate(data => {
        const newItemDetail = this.validateFormDetail.value;
        // Check for duplicates within the existing data
        this.duplicated = data.some((item) => {
          if (item.itemData?.id === newItemDetail?.selectedItem?.id) {
            return item?.itemDetails.some(
              (detail) =>
                detail?.expirationDate === newItemDetail?.expirationDate &&
                detail?.lotNo === newItemDetail?.lotNo && detail?.barcodeNo === newItemDetail?.barcodeNo
            );
          }
          return false;
        });

        if (this.duplicated) {
          this.msg.error('Same expiration date & lot No. cannot be added');
        } else {
          // Add the item to the appropriate group or create a new group
          const existingGroupIndex = data.findIndex(
            (item) => item?.itemData?.id === newItemDetail?.selectedItem?.id
          );

          if (existingGroupIndex !== -1) {
            // Add to an existing group
            data[existingGroupIndex]?.itemDetails.push(
              this.validateFormDetail.value
            );
            this.footerTotalCost()
            // this.selectElement.nativeElement.focus()
            this.cd.detectChanges()

          } else {
            // Create a new group
            this.itemDataList.set([...this.itemDataList(), { itemData: this.validateFormDetail.get('selectedItem').value, itemDetails: [this.validateFormDetail.value] }])

          }
        }
        this.footerTotalCost()
        // this.selectElement.nativeElement.focus()
        this.cd.detectChanges()


      })
    } else {
      Object.values(this.validateFormDetail.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

    }
  }

}
