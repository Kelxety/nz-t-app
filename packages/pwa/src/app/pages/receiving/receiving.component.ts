import { ChangeDetectorRef, Component, DestroyRef, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScmItem, ScmReceiveMode, ScmSupplier, ScmWarehouse } from '@prisma/client';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinService } from '../../core/services/store/common-store/spin.service';
import { SharedModule } from '../../shared';
import { fnCheckForm } from '../../utils/tools';
import { ModalBtnStatus } from '../../widget/base-modal';
import { ItemCatergoryServices } from '../configuration/Services/item-category/item-category.service';
import { ItemDetailServices } from '../configuration/Services/item-detail/item-detail.service';
import { ItemServices } from '../configuration/Services/item/item.service';
import { ReceivingModeServices } from '../configuration/Services/receving-mode/stock-receving-mode.service';
import { StockReceivingServices } from '../configuration/Services/stock-receiving/stock-receiving.service';
import { StockReceivingDtlServices } from '../configuration/Services/stock-receving-dtl/stock-receiving-dtl.service';
import { SupplierServices } from '../configuration/Services/supplier/supplier.service';
import { UnitServices } from '../configuration/Services/unit/unit.service';
import { WarehouseServices } from '../configuration/Services/warehouse/warehouse.service';
import { TableModalService } from './table-modal/table-modal.service';

interface dataModel {
  list: any;
  filteredList: any[];
  selected?: any;
  hasSelected?: boolean;
  loading?: boolean;
  isModalShow?: boolean;
  isSubmitting?: boolean;
}

interface Data {
  itemData: any;
  itemDetails: any
}
@Component({
  selector: 'app-receiving',
  templateUrl: './receiving.component.html',
  styleUrls: ['./receiving.component.less'],
  standalone: true,
  imports: [SharedModule],
})
export class ReceivingComponent {

  @ViewChild('selectItem') selectElement!: ElementRef;
  isCollapsed = false;
  validateForm!: UntypedFormGroup;
  validateFormDetail!: UntypedFormGroup;
  public tableHeight!: number;
  optionListWarehouse: any;
  optionListSupplier: any;
  optionListRM: any;
  optionList: any

  itemDataList = signal<any>([])

  listOfCurrentPageData: any = [];

  listOfOption = [
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' },
    { label: 'Transaction', value: 'Transaction' },
    { label: 'Out of stock', value: 'Out of stock' }
  ];

  model: any = {
    list: [],
    filteredList: [],
    isSubmitting: false,
    loading: false
  };

  warehouse: any = { whName: null, whAcro: null, state: 'Active' }

  supplier: any = { supplierName: null, state: 'Active' }
  newRecvMode: any = { recvMode: null, state: 'Active' }

  isLoading = false;
  isVisible = false;
  duplicated = false
  newDataGroup = false
  destroyRef = inject(DestroyRef);

  selectedValue = 'Active';

  listOfItemWarehouse: ScmWarehouse[] = [];
  listOfItemSupplier: ScmSupplier[] = [];
  listOfItemRm: ScmReceiveMode[] = [];
  listOfItem: ScmItem[] = [];
  index = 0;

  totalCost = signal<number>(0)
  totalCostAmount = signal<number>(0)
  refNo = signal<any>('')

  constructor(
    private fb: UntypedFormBuilder,
    private spinService: SpinService,
    private msg: NzMessageService,
    private itemCatergoryServices: ItemCatergoryServices,
    private supplierServices: SupplierServices,
    private warehouseServices: WarehouseServices,
    private receivingModeServices: ReceivingModeServices,
    private itemServices: ItemServices,
    private unitServices: UnitServices,
    private route: ActivatedRoute,
    private itemDetailServices: ItemDetailServices,
    private stockReceivingServices: StockReceivingServices,
    private stockReceivingDtlServices: StockReceivingDtlServices,
    private modalService: TableModalService,
    private modalSrv: NzModalService,
    private router: Router,
    private cd: ChangeDetectorRef) {
    this.validateForm = this.fb.group({
      rcvDate: [new Date(), [Validators.required]],
      rcvRefno: [null],
      // warehouseId: [null, [Validators.required]],
      supplierId: [null, [Validators.required]],
      receivemodeId: [null, [Validators.required]],
      purchaserequestNo: [null],
      deliveryreceiptNo: [null],
      purchaseorderNo: [null],
      isPosted: [false],
      remarks: [null],
      state: ['Active']
    });

    this.validateFormDetail = this.fb.group({
      selectedItem: [null, [Validators.required]],
      receiveId: [null],
      itemdtlId: [null],
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

  ngOnInit(): void {
    // this.loadAccount()
    const promise = [Promise.resolve(this.loadUnitData()),
    Promise.resolve(this.loadWarehouse()),
    Promise.resolve(this.loadSupplier()),
    Promise.resolve(this.loadRm()),
    Promise.resolve(this.loadItems())]
    Promise.all(promise)
    this.spinService.setCurrentGlobalSpinStore(false);
    // this.validateFormDetail.disable()

  }
  onCurrentPageDataChange($event: readonly any[]): void {
    this.listOfCurrentPageData = $event;
    this.cd.detectChanges
  }

  private setupFormChangeListeners() {
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

  loadItems() {
    this.itemServices.list({ pagination: false, state: 'Active' }).subscribe({
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

  removeFromHeaderList(data: any) {
    if (data.itemData === null) {
      this.itemDataList.update(list => {
        return list.filter(item => item.itemData !== null);
      });
    } else {
      this.itemDataList.update(list => {
        return list.filter(item => item.itemData.id !== data.itemData.id);
      });
    }
    this.footerTotalCost()

  }

  removeFromDetailList(data: any, detailData: any) {
    console.log(data)
    this.itemDataList.update(list => {
      // Find the index of the itemData to modify
      const existingGroupIndex = list.findIndex(
        item => item.itemData.id === data.itemData.id
      );

      // If the itemData exists and the index is valid
      if (existingGroupIndex !== -1) {

        const itemDetails = list[existingGroupIndex].itemDetails;

        // Find the index of the itemDetail to remove based on the condition
        const itemDetailIndexToRemove = itemDetails.findIndex(itemDetail =>

          itemDetail.expirationDate === detailData.expirationDate &&
          itemDetail.lotNo === detailData.lotNo
        );

        // If the itemDetail index to remove is valid, remove it from itemDetails
        if (itemDetailIndexToRemove !== -1) {
          itemDetails.splice(itemDetailIndexToRemove, 1);
        }
      }

      return list;
    });
    this.footerTotalCost()
  }

  onSubmit() {

    console.log('submit')
    if (!fnCheckForm(this.validateForm)) {
      return of(false);
    }
    if (this.itemDataList() === null || this.itemDataList().length === 0) {
      return this.msg.info('Please add for receving items')
    }
    return this.onSaveAll()

  }

  async onSaveAll() {

    if (this.validateForm.valid) {
      const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId
      // this.validateForm.get('receivemodeId').setValue(this.validateForm.get('receivemodeId').value.id)
      this.stockReceivingServices.create(this.validateForm.getRawValue()).subscribe({
        next: (value: any) => {
          this.msg.remove(id)
          // this.updateRcvHdrForRefNo(value)
          this.refNo.set(value.data.rcvRefno)
          this.saveToItemDetail(value)

        }, error: (error: any) => {
          if (error) {
            if (typeof error) {
              this.msg.error(`${error.error.error} must be unique "${error.error.message}"`)
            }
            this.msg.remove(id)
            this.msg.error('Unsuccessfully saved')
            this.cd.detectChanges()
          }
        }, complete: () => {
          // this.msg.success('Item saved successfully!');
          this.cd.detectChanges()
        },
      })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

    }
  }

  // updateRcvHdrForRefNo(data: any) {

  //   let refNo = `${formatDate(this.validateForm.get('rcvDate').value, 'yyyy-MM', 'en-PH')}-${data.data.id.split('-').pop()}`
  //   this.stockReceivingServices.patch(data.data.id, { rcvRefno: refNo }).subscribe({
  //     next: (res: any) => {
  //       console.log(res, 'ref')
  //       this.refNo.set(res.data.rcvRefno)

  //     }
  //   })
  // }

  saveToItemDetail(rcvData: any) {
    const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId
    let model: any = []
    try {
      const updates = this.itemDataList.mutate(async (data) => {

        const itemDetailPromises = [];

        for (const res of data) {
          res.loadNow = true;
          this.cd.detectChanges();

          for (const newRes of res.itemDetails) {

            model = {}
            model.balanceQty = newRes?.qty
            model.barcode = newRes?.barcodeNo
            model.batchNo = newRes?.batchNo
            model.brandName = newRes?.brandName
            model.cost = newRes?.cost
            model.expirationDate = newRes?.expirationDate
            model.entryDate = this.validateForm.get('rcvDate').value
            model.itemId = newRes?.selectedItem.id
            model.lotNo = newRes?.lotNo
            model.markup = newRes?.markup
            model.price = newRes?.price
            model.rrMode = this.validateForm.get('receivemodeId').value
            model.state = 'Active'
            model.subitemCode = newRes?.subitemCode
            model.subitemName = newRes?.subitemName
            model.unitId = newRes?.unitId
            console.log(model, 'model')

            const itemDetailPromise = new Promise((resolve, reject) => {
              this.itemDetailServices.create(model).subscribe({
                next: (val: any) => {
                  res.loadNow = false;
                  this.cd.detectChanges();
                  this.saveToRcvDetail(newRes, rcvData.data.id, val.data.id);
                  resolve(itemDetailPromise);
                },
                error: (error) => {
                  if (error) {
                    if (typeof error) {
                      this.msg.error(`${error.error.error} must be unique "${error.error.message}"`);
                    }
                    res.loadNow = 'ERROR';
                    this.msg.error('Unsuccessfully saved');
                    this.cd.detectChanges();
                  }
                  reject(error);
                },
              });
            });

            itemDetailPromises.push(itemDetailPromise);
          }
        }

        await Promise.all(itemDetailPromises);
        return data;
      })
      this.msg.remove(id);
      this.msg.success('Item saved successfully!');
      this.success()
      this.resetForm()
    } catch (error) {
      console.error('An error occurred:', error);
      this.msg.remove(id);
      this.msg.error('Error occurred during item creation.');
    }

  }

  async saveToRcvDetail(data: any, rcvId: any, rcvDtlId: any): Promise<any> {
    return new Promise((resolve, reject) => {

      let model: any = []
      model = {}
      model.barcodeNo = data?.barcodeNo
      model.batchNo = data?.batchNo
      model.cost = data?.cost
      model.costAmount = data.costAmount
      model.expirationDate = data?.expirationDate
      model.itemdtlId = rcvDtlId
      model.lotNo = data?.lotNo
      model.qty = data?.qty
      model.receiveId = rcvId

      this.stockReceivingDtlServices.create(model).subscribe({
        next: (val) => {
          resolve(val)
        }, error: (error) => {

          if (error) {
            if (typeof error) {
              this.msg.error(`${error.error.error} must be unique "${error.error.message}"`)
            }

            this.msg.error('Unsuccessfully saved')
            this.cd.detectChanges()
          }
          reject(error)
        }
      })
    });
  }

  success(): void {
    this.modalSrv.success({
      nzTitle: 'Reference No.',
      nzContent: this.refNo(),
      nzCentered: true,
      // nzOnOk: () => { console.log('print') },
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default'
        },
        {
          label: 'Print',
          type: 'primary',
          onClick: () => { console.log('print') },

        }
      ]

    });
  }

  resetForm() {
    this.validateFormDetail.reset()
    this.totalCostAmount.set(0)
    this.itemDataList.update(list => {
      return list = null
    });
  }

  onTransactionList() {
    this.router.navigate(['/default/receiving-transaction-list']);
  }

  onView(): void {
    this.modalService
      .show({ nzTitle: 'Receiving list' }, this.itemDataList())
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        if (!res || res.status === ModalBtnStatus.Cancel) {
          return;
        }
        // this.tableLoading(true);
        this.itemDataList.set(res)
      });
  }

  viewTable(): void {

    this.modalService
      .show({ nzTitle: 'Receiving list', nzMask: false }, this.itemDataList())
      .pipe(
        finalize(() => {
          // this.tableLoading(false);

        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        if (!res || res.status === ModalBtnStatus.Cancel) {
          return;
        }
        // console.log(res);
        const param = { ...res.modalValue };
        this.itemDataList.set(res.modalValue)
        console.log(param)
        // this.tableLoading(true);
        // this.addEditData(param, 'addRoles');
      });
  }

  onClearForm1() {
    this.validateForm.reset()
    this.validateForm.patchValue(
      {
        rcvDate: new Date(),
      }
    )
  }

}
