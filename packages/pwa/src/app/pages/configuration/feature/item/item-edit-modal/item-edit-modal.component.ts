import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScmItem, ScmItemCategory, ScmItemDtl } from '@prisma/client';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { SpinService } from '../../../../../core/services/store/common-store/spin.service';
import { SharedModule } from '../../../../../shared';
import { ResType } from '../../../../../utils/types/return-types';
import { ItemCatergoryServices } from '../../../Services/item-category/item-category.service';
import { ItemDetailServices } from '../../../Services/item-detail/item-detail.service';
import { ItemServices } from '../../../Services/item/item.service';

interface dataModel {
  list: any;
  filteredList: any[];
  selected?: any;
  hasSelected?: boolean;
  loading?: boolean;
  isModalShow?: boolean;
  isSubmitting?: boolean;
}

interface data {
  id: string;
  itemCode: string;
  barcode: string;
  itemName: string;
  itemDescription: string;
  itemcategoryId: string;
  unitId: string;
  state: string;
  remarks: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;

}

@Component({
  selector: 'app-item-edit-modal',
  templateUrl: './item-edit-modal.component.html',
  styleUrls: ['./item-edit-modal.component.less'],
  standalone: true,
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemEditModalComponent {

  private ngUnsubscribe = new Subject();
  public tableHeight!: number;
  isCollapsed = false;
  itemDisable = true;
  validateForm!: UntypedFormGroup;
  validateFormDetail!: UntypedFormGroup;
  data: ScmItem
  selectedValue = 'Active';
  dataModel: any = {};

  listOfOption = [
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' }
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
      expirationDate: [new Date(), [Validators.required]],
      itemId: [null],
      subitemCode: [null],
      subitemName: [null, [Validators.min(4), Validators.required]],
      barcode: [null],
      unitId: [null],
      brandName: [null],
      lotNo: [null],
      batchNo: [],
      markup: [0, [Validators.required]],
      balanceQty: [0, [Validators.required]],
      price: [0, [Validators.required]],
      cost: [0, [Validators.required]],
      state: ['Active'],
    });

    if (this.route.snapshot.params) {

      this.id = this.route.snapshot?.params;

    }
  }

  ngOnInit(): void {

    this.loadAccount()
    this.spinService.setCurrentGlobalSpinStore(false);
    if (this.id) {
      this.dataLabel = 'Edit'
      this.loadData()
    }
  }

  loadData() {
    let model: any = this.model;
    model.loading = true;

    console.log(this.data)
    this.itemServices.get(this.id?.id).subscribe({
      next: (res: ResType<any>) => {
        this.validateForm.patchValue({
          itemCode: res?.data?.itemCode,
          itemName: res?.data?.itemName,
          itemDescription: res?.data?.itemDescription,
          state: res?.data?.state,
          itemcategoryId: res?.data?.scmItemCategory?.id,
        })
      },
      error: (err: any) => {

      },
      complete: () => {
        model.loading = false;
        // this.cd.detectChanges();
      }
    })
    // this.itemServices.list({ order: order, pagination: false }).subscribe({
    //   next: (res: ResType<ScmItemDtl[]>) => {
    //     const list = res.data;

    //     model.list = list;
    //     model.filteredList = list;
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //   },
    //   complete: () => {
    //     model.loading = false;
    //     this.cd.detectChanges();
    //   }
    // });
  }


  onCreateItem() {
    let form: any = Object.assign({}, this.validateForm.value);

    console.log(this.validateForm.getRawValue())
    this.itemServices.create(this.validateForm.getRawValue()).subscribe({
      next: (res: any) => {
        this.resetForm();
        this.msg.success('Item saved successfully!');
        this.isCollapsed = true
        this.data = res.data
        //  this.statusData.emit({status: 200, data: res})
      },
      error: (error: any) => {
        if (typeof error.error.violations !== 'undefined') {
          error.error.violations.map((violation: any) => {
            const prop = violation.propertyPath;
            const formControl = this.validateForm.get(prop);
            if (formControl) {
              if (formControl.errors !== null && formControl.errors['other']) {
                formControl.errors['other'].push(violation.message);
              } else {
                formControl.setErrors({
                  other: [violation.message],
                });
              }
            }
          });
        }
      },
      complete: () => {

      }
    });
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
    let form: any = Object.assign({}, this.validateForm.value);

    console.log(JSON.stringify(form))
    this.itemDetailServices.create(form).subscribe({
      next: (res: ResType<ScmItemDtl[]>) => {
        this.resetForm();
        this.msg.success('Item saved successfully!');
        //  this.statusData.emit({status: 200, data: res})
      },
      error: (error: any) => {
        if (typeof error.error.violations !== 'undefined') {
          error.error.violations.map((violation: any) => {
            const prop = violation.propertyPath;
            const formControl = this.validateForm.get(prop);
            if (formControl) {
              if (formControl.errors !== null && formControl.errors['other']) {
                formControl.errors['other'].push(violation.message);
              } else {
                formControl.setErrors({
                  other: [violation.message],
                });
              }
            }
          });
        }
      },
      complete: () => {

      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/default/configuration/item']);
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

}

