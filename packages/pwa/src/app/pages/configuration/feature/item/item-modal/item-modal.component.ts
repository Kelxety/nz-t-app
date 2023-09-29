import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScmItem, ScmItemCategory, ScmItemDtl } from '@prisma/client';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Subject } from 'rxjs';
import { SpinService } from '../../../../../core/services/store/common-store/spin.service';
import { SharedModule } from '../../../../../shared';
import { ResType } from '../../../../../utils/types/return-types';
import { ItemCatergoryServices } from '../../../Services/item-category/item-category.service';
import { ItemDetailServices } from '../../../Services/item-detail/item-detail.service';
import { ItemServices } from '../../../Services/item/item.service';
import { UnitServices } from '../../../Services/unit/unit.service';

interface dataModel {
  list: any;
  filteredList: any[];
  selected?: any;
  hasSelected?: boolean;
  loading?: boolean;
  isModalShow?: boolean;
  isSubmitting?: boolean;
}

interface ItemDtldata {
  id: string;
  itemCode: string;
  barcode: string;
  itemName: string;
  itemDescription: string;
  itemcategoryId: string;
  unitId: string;
  itemId: string
  state: string;
  remarks: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;

}
@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.less'],
  standalone: true,
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemModalComponent {
  private ngUnsubscribe = new Subject();
  public tableHeight!: number;
  isCollapsed = false;
  itemDisable = true;
  btnDisable = false
  dtlBtn = true
  validateForm!: UntypedFormGroup;
  validateFormDetail!: UntypedFormGroup;
  data: ScmItem
  selectedValue = 'Active';
  dataModel: any = {};

  searchChange$ = new BehaviorSubject('');
  optionList: any;
  selectedUser?: string;
  isLoading = false;

  listOfOption = [
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' },
    { label: 'Transaction', value: 'Transaction' },
    { label: 'Out of stock', value: 'Out of stock' }
  ];

  treeData: any;
  id!: any;
  date = new Date();

  dataLabel: string

  listOfCurrentPageData: readonly ScmItemDtl[] = [];
  listOfData: readonly ScmItemDtl[] = [];
  setOfCheckedId = new Set<string>();

  model: any = {
    list: [],
    filteredList: [],
    isSubmitting: false,
    loading: true
  };

  accountModel: dataModel = {
    list: [],
    filteredList: [],
    hasSelected: false,
    selected: {},
    isModalShow: false,
    isSubmitting: false,
    loading: true
  }

  @ViewChild('tableContainer') private readonly _tableContainer!: ElementRef;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private spinService: SpinService,
    private msg: NzMessageService,
    private itemCatergoryServices: ItemCatergoryServices,
    private itemServices: ItemServices,
    private unitServices: UnitServices,
    private route: ActivatedRoute,
    private itemDetailServices: ItemDetailServices,
    private cd: ChangeDetectorRef,) {
    this.validateForm = this.fb.group({
      itemCode: [null],
      itemName: [null, [Validators.min(4), Validators.required]],
      itemDescription: [null],
      itemcategoryId: [null, [Validators.required]],
      state: ['Active']

    });
    this.validateFormDetail = this.fb.group({
      entryDate: [new Date()],
      expirationDate: [null],
      itemId: [null],
      subitemCode: [null],
      subitemName: [null, [Validators.min(4), Validators.required]],
      barcode: [null],
      unitId: [null],
      brandName: [null],
      lotNo: [null],
      batchNo: [null],
      markup: [0],
      balanceQty: [0, [Validators.required]],
      price: [0, [Validators.required]],
      cost: [0, [Validators.required]],
      state: ['Active'],
    });

    this.setupFormChangeListeners();

  }

  ngOnInit(): void {

    this.loadAccount()
    this.loadUnitData()
    this.spinService.setCurrentGlobalSpinStore(false);
    // this.validateFormDetail.disable()

  }

  onCurrentPageDataChange($event: readonly any[]): void {
    this.listOfCurrentPageData = $event;
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


  }


  private computePriceOrMarkup() {
    const cost = this.validateFormDetail.get('cost').value;
    const markup = this.validateFormDetail.get('markup').value;

    if (cost !== null && markup !== null) {
      const price = this.roundToTwoDecimals(cost + cost * (markup / 100));
      this.validateFormDetail.get('price').setValue(price, { emitEvent: false });
    } else {
      this.validateFormDetail.get('price').setValue(0, { emitEvent: false });
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


  loadData() {
    let model: any = this.model;
    model.loading = true;


    this.itemDetailServices.list({ pagination: false, state: 'Active', filteredObject: JSON.stringify({ itemId: this.data?.id }) }).subscribe({
      next: (res: ResType<ScmItemDtl[]>) => {
        const list = res.data;

        model.list = list;
        model.filteredList = list;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        model.loading = false;
        this.cd.detectChanges();
      }
    });
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

  onCreateItem() {

    if (this.validateForm.valid) {
      const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId
      this.btnDisable = true
      this.itemServices.create(this.validateForm.getRawValue()).subscribe({
        next: (res: any) => {
          this.msg.remove(id)
          this.validateFormDetail.get('markup').setValue(0)
          console.log(res.data)
          this.data = res.data
          //  this.statusData.emit({status: 200, data: res})
        },
        error: (error: any) => {
          // console.log(error.error)
          if (error) {
            if (typeof error) {
              this.msg.error(`${error.error.error} must be unique "${error.error.message}"`)
            }
            this.msg.remove(id)
            this.msg.error('Unsuccessfully saved')
            this.btnDisable = false
            this.cd.detectChanges()
          }
        },
        complete: () => {
          this.msg.success('Item saved successfully!');
          this.btnDisable = false
          this.dtlBtn = false
          this.isCollapsed = true
          this.resetForm();
          this.loadData()
          this.cd.detectChanges()

        }
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.btnDisable = false
        }
      });

    }

  }

  onUpdateItem() {
    let model: any = this.model;
    model.loading = true;
    this.itemServices.patch(this.id.id, this.validateForm.getRawValue()).subscribe({
      next: (res: any) => {
        this.msg.success('Item updated successfully')
        this.isCollapsed = true

      },
      error: (err: any) => {

      },
      complete: () => {
        model.loading = false;
        this.cd.detectChanges();
      }
    })
  }

  onAddItem() {
    if (this.validateFormDetail.valid) {
      this.validateFormDetail.get('itemId').setValue(this.data.id)
      const id = this.msg.loading('Action in progress..', { nzAnimate: true }).messageId
      this.dtlBtn = true
      this.itemDetailServices.create(this.validateFormDetail.getRawValue()).subscribe({
        next: (res: any) => {
          this.msg.remove(id)
          //  this.statusData.emit({status: 200, data: res})
        },
        error: (error: any) => {
          if (error.code === 400) {
            this.dtlBtn = false
            this.msg.error('Unsuccessfully saved')
          }
        },
        complete: () => {
          this.msg.success('Item saved successfully!');
          this.loadData()
          this.dtlBtn = false
          this.resetForm2()
        }
      });
    } else {
      Object.values(this.validateFormDetail.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.dtlBtn = false
        }
      });

    }
  }

  onCancel(): void {
    this.router.navigate(['/default/configuration/item']);
    this.validateFormDetail.disable()
    this.isCollapsed = false
  }

  loadAccount() {
    let model = this.accountModel;
    let order: any = [{
      sortColumn: 'sortOrder',
      sortDirection: 'asc'
    }];

    model.loading = true;
    this.itemCatergoryServices.list({ order: order, pagination: false }).subscribe({
      next: (res: ResType<ScmItemCategory[]>) => {
        const list = res.data;
        let tempList: any[] = [];
        list.map((x: ScmItemCategory) => {
          let tempParent: string | null = null;
          if (x.parentId) { tempParent = x.parentId }

          tempList.push({
            title: `${x.catAcro} - ${x.catName}`,
            key: x.id,
            parentId: tempParent
          })
        });

        this.treeData = this.treeConstruct(tempList);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        model.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  treeConstruct(treeData: any): Promise<any> {
    let constructedTree: any = [];
    for (let i of treeData) {
      let treeObj = i;
      let assigned = false;
      this.constructTree(constructedTree, treeObj, assigned);
    }
    return constructedTree;
  }

  constructTree(constructedTree: any, treeObj: any, assigned: any): boolean {
    if (treeObj.parentId == null) {
      treeObj.children = [];
      treeObj.expanded = true;
      treeObj.selectable = true;
      treeObj.isLeaf = false;
      constructedTree.push(treeObj);
      return true;
    } else if (treeObj.parentId == constructedTree.key) {
      treeObj.children = [];
      treeObj.expanded = true;
      treeObj.selectable = true;
      treeObj.isLeaf = false;
      constructedTree.children.push(treeObj);
      return true;
    } else {
      treeObj.expanded = false;
      treeObj.selectable = true;
      treeObj.isLeaf = true;
      if (constructedTree.children != undefined) {
        for (let index = 0; index < constructedTree.children.length; index++) {
          let constructedObj = constructedTree.children[index];
          if (assigned == false) {
            assigned = this.constructTree(constructedObj, treeObj, assigned);
          }
        }
      } else {
        constructedTree.selectable = false;
        constructedTree.isLeaf = true;
        for (let index = 0; index < constructedTree.length; index++) {
          let constructedObj = constructedTree[index];
          if (assigned == false) {
            assigned = this.constructTree(constructedObj, treeObj, assigned);
          }
        }
      }
      return false;
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

  resetForm2(): void {
    // e.preventDefault();
    this.validateFormDetail.reset();
    this.validateFormDetail.patchValue({
      state: 'Active',
      entryDate: new Date(),
      balanceQty: 0,
      markup: 0
    })

    this.validateFormDetail.get('cost').setValue(0, { emitEvent: false });
    this.validateFormDetail.get('markup').setValue(0, { emitEvent: false });


    for (const key in this.validateFormDetail.controls) {
      if (this.validateFormDetail.controls.hasOwnProperty(key)) {
        this.validateFormDetail.controls[key].markAsPristine();
        this.validateFormDetail.controls[key].updateValueAndValidity();
      }
    }
  }

}
