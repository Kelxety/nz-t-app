import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { LocationBarangayService, LocationMunicipalityService, TmsRptLedgerPaymentDetailService, TmsRptLedgerService, AccountService } from '@app/shared/data-access/api';
import { TmsRptLedgerPaymentService } from '@app/shared/data-access/api/tms-rpt-ledger-payment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { Subject, takeUntil } from 'rxjs';

interface statusState {
  status: number;
  data: any;
}

interface dataModel {
  list: any;
  filteredList: any[];
  selected?: any;
  hasSelected?: boolean;
  loading?: boolean;
  isModalShow?: boolean;
  isSubmitting?: boolean;
}

@Component({
  selector: 'app-tms-rpt-ledger-payment-modal',
  templateUrl: './tms-rpt-ledger-payment-modal.component.html',
  styleUrls: ['./tms-rpt-ledger-payment-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmsRptLedgerPaymentModalComponent implements OnInit, AfterViewInit {
  private ngUnsubscribe = new Subject();
  @Input() actionType: string = 'create'; //create, edit, view, delete
  @Input() id: string = ''; // primary key
  @Input() ledger: string = ''; // fk
  @Output() statusData: EventEmitter<statusState> = new EventEmitter();

  nodes: NzTreeNodeOptions[] = [];

  readonly #modal = inject(NzModalRef);
  readonly nzData: any = inject(NZ_MODAL_DATA);

  validateForm: UntypedFormGroup;
  dataModel: any = {};
  isLoading: boolean = false;

  municipalityModel: dataModel = {
    list: [],
    filteredList: [],
    hasSelected: false,
    selected: {},
    isModalShow: false,
    isSubmitting: false,
    loading: true
  }

  barangayModel: dataModel = {
    list: [],
    filteredList: [],
    hasSelected: false,
    selected: {},
    isModalShow: false,
    isSubmitting: false,
    loading: true
  }

  accountModel: dataModel = {
    list: [],
    filteredList: [],
    hasSelected: false,
    selected: {},
    isModalShow: false,
    isSubmitting: false,
    loading: true
  }

  uuid: string | null  = '';
  search: string = '';
  mainModel: any = {
    list: [],
    filteredList: [],
    isSubmitting: false,
    loading: false,
    totalAmount: 0
  }

  detailModel: any = {
    ledgerpayment: null,
    account: '',
    amount: 0
  }

  

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly any[] = [];
  listOfData: readonly any[] = [];
  setOfCheckedId = new Set<string>();
  listOfSelection = [];

  treeData: any
  constructor (
    private cd: ChangeDetectorRef,
    private fb: UntypedFormBuilder,
    public apiService: TmsRptLedgerPaymentService,
    public apiDetail: TmsRptLedgerPaymentDetailService,
    public apiAccount: AccountService,
    public apiMunicipality: LocationMunicipalityService,
    public apiBarangay: LocationBarangayService,
    private msg: NzMessageService,
  ) {

    this.id = this.nzData.id;
    this.ledger = this.nzData.ledger;
    this.actionType = this.nzData.actionType;

    this.validateForm = this.fb.group({
      ledger:     ['', [Validators.required]],
      orNo:       ['', [Validators.required]],
      orDate:     [null, [Validators.required]],
      orPayor:    ['', [Validators.required]],
      orType:     ['', [Validators.required]],
      totalAmount:['', [Validators.required]],
      barangay:   [null, [Validators.required]],
      qtrFrom:    ['', [Validators.required]],
      yearFrom:   ['', [Validators.required]],
      qtrTo:      ['', [Validators.required]],
      yearTo:     ['', [Validators.required]],
      isPosted:   [true,  []],
      postedBy:   ['',    []],
      postedAt:   [null,  []],
      remarks:    ['',    []],
      state:      [true,  [Validators.required]],
    });
  }

  ngOnInit() {
    // this.loadMunicipality();
    this.loadAccount();
    if (this.actionType === 'edit' || this.actionType === 'delete' || this.actionType === 'view') {
      this.getData();
    } else {
      this.resetForm();
    }
  }

  ngAfterViewInit(): void {

  }

  tempValue() {
    console.log('VALUES', this.validateForm.value);
  }

  resetForm(): void {
    // e.preventDefault();
    this.validateForm.reset();
    this.validateForm.patchValue({
      orDate: new Date,
      state: true,
      qtrFrom: '1',
      yearFrom: '2023',
      qtrTo: '4',
      yearTo: '2023',
      ledger: this.ledger
    })

    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  resetDetailForm(): void {
    // e.preventDefault();
    this.detailModel = {
      ledgerpayment: null,
      account: null,
      amount: 0
    }
  }

  loadAccount() {
    let model = this.accountModel;
    let order: any = [{
      sortColumn: 'accountTitle',
      sortDirection: 'asc'
    }];

    model.loading = true;
    this.apiAccount.list({ledgerpayment: this.id, order: order, pagination: false}).subscribe({
      next: (res:any) => {
        const list = res['hydra:member'];
        let tempList: any[] = [];
        list.map((x: any) => {
          let tempParent: string | null = null;
          if (x.parentId) { tempParent = x.parentId }

          tempList.push({
            title: `${x.accountCode} - ${x.accountTitle}`,
            key: x.id,
            parentId: tempParent
          })
        });

        this.treeData = this.treeConstruct(tempList);
        this.cd.detectChanges();
        console.log('Sample TREE', this.treeData);
        this.loadMunicipality();
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

  loadMunicipality() {
    let order: any = [{
      sortColumn: 'municipalityName',
      sortDirection: 'asc'
    }];

    this.municipalityModel.loading = true;
    this.apiMunicipality.list({order: order, pagination: false}).subscribe({
      next: (res:any) => {
        this.loadBarangay();
        const list = res['hydra:member'];
        let tempData: NzTreeNodeOptions[] = [];
        list.map((x:any) => {
          tempData.push({
            title: `${x.municipalityName}`, 
            key: x['@id'], 
            expanded: true,
            selectable: false,
            children: [],
            isLeaf: false
          });
        })
        this.municipalityModel.list = tempData;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.municipalityModel.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  loadBarangay() {
    let order: any = [{
      sortColumn: 'barangayName',
      sortDirection: 'asc'
    }];

    this.barangayModel.loading = true;
    this.apiBarangay.list({pagination: false}).subscribe({
      next: (res:any) => {
        const list = res['hydra:member'];
        console.log('BRGY', list);
        let tempData: NzTreeNodeOptions[] = [];

        this.municipalityModel.list.map((m:any) => {
          let children: NzTreeNodeOptions[] = [];
          list.map((b:any) => {
            if (m.key === b.municipality['@id']) {
              children.push({
                title: `Bgy. ${b.barangayName}`, 
                key: b['@id'], 
                expanded: false,
                selectable: true,
                isLeaf: true,
                fk: b.municipality['@id']
              });
            }
          });
          m.children = children;
        });
        // list.map((x:any) => {
          
        //   tempData.push();
        // })
        // this.barangayModel.list = tempData;
        this.nodes = this.municipalityModel.list;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.barangayModel.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  loadData() {
    let model: any = this.mainModel;
    model.loading = true;
    
    let order: any = [{
      sortColumn: 'accountName',
      sortDirection: 'asc'
    }];
    this.apiDetail.list({ledgerpayment: this.id, order: order, pagination: false}).subscribe({
      next: (res:any) => {
        const list = res['hydra:member'];
        model.list = list;
        model.filteredList = list;
        this.countTotal();
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

  getData() {
    this.mainModel.loading = true;
    this.apiService.get(this.id).subscribe({
      next: (res:any) => {
        this.dataModel = res;
        this.mainModel.list = res.datails;
        this.validateForm.patchValue({
          ledger:      res.ledger,   
          orNo:        res.orNo,
          orDate:      res.orDate,    
          orPayor:     res.orPayor,
          orType:      res.orType,
          totalAmount: res.totalAmount,     
          barangay:    res.barangay,     
          qtrFrom:     res.qtrFrom.toString(),
          yearFrom:    res.yearFrom.toString(),
          qtrTo:       res.qtrTo.toString(),
          yearTo:      res.yearTo.toString(),
          isPosted:    res.isPosted,
          postedBy:    res.postedBy,
          postedAt:    res.postedAt,
          remarks:     res.remarks,
          state:       res.state
        });
        console.log('SSSSS', this.validateForm.value);
        this.loadData();
      },
      error: (error: any) => {
        this.statusData.emit({status:500, data:{}});
        console.log('EEEEE', error);
      },
      complete: () => {
        this.mainModel.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  convertStatus(isActive: boolean) {
    let str: string = 'Active';
    if (!isActive) { str = 'In-active'}
    return str
  }

  submitCreate() {
    let form: any = Object.assign({}, this.validateForm.value);
    if (form.state){ form.state = 'Active'} else { form.state = 'In-active'};
    form.qtrFrom =  parseInt(form.qtrFrom);
    form.yearFrom =  parseInt(form.yearFrom);
    form.qtrTo =  parseInt(form.qtrTo);
    form.yearTo =  parseInt(form.yearTo);

    console.log('SSSSSSSSS', form);
    this.apiService.create(form).subscribe({
      next: (res:any) => {
         this.msg.success('Added successfully!');
         this.id = res.id,
         this.getData();
         this.actionType = 'edit';
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

  submitDelete() {

  }

  submitEdit() {
    let form: any = Object.assign({}, this.validateForm.value);
    if (form.state){ form.state = 'Active'} else { form.state = 'In-active'};
    form.qtrFrom =  parseInt(form.qtrFrom);
    form.yearFrom =  parseInt(form.yearFrom);
    form.qtrTo =  parseInt(form.qtrTo);
    form.yearTo =  parseInt(form.yearTo);

    this.apiService.update(this.id, form).subscribe({
      next: (res:any) => {
        this.msg.success('Successfully updated!');
        this.statusData.emit({status: 200, data: res})
        this.closeMe();
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

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }

    this.listOfSelection = [];
    let opt: any = [];
    if (this.setOfCheckedId.size === 1) {
      opt.push({text: 'Edit selected', onSelect: () => {}});
    }
    if (this.setOfCheckedId.size >= 1) {
      opt.push({text: 'Delete selected', onSelect: () => {}});
    }

    this.listOfSelection = opt;
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly any[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  confirm(data: any): void {
    this.delete(data);
  }

  delete(data: any): void { // p: primary model, a: api service, data: row to delete
    let model: any = this.mainModel;
    const id = data.id;
    const load = this.msg.loading('Removing in progress..', { nzDuration: 0 }).messageId;

    this.apiDetail.delete(id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: () => {
        model.list = model.list.filter((item: any) => item.id !== data.id);
        this.filter(this.search);
        this.countTotal();
        this.msg.remove(load);
        this.cd.detectChanges();
      },
      error: (err:any) => {
        this.msg.warning(err.message);
        this.msg.remove(load);
      },
        complete: () => {
      }
    });
  }

  cancel(): void {
    // this.msg.info('click cancel');
  }

  filter(f: string) {
    this.search = f;
    this.mainModel.filteredList =  this.mainModel.list.filter((d: any) => (d.account.accountTitle).toLowerCase().indexOf(this.search.toLowerCase())>-1);
    this.cd.detectChanges();
  }

  submitDetail() {
    let form: any = Object.assign({}, this.detailModel);
    form.account = `${this.apiAccount.baseUrl}/${form.account}`
    form.ledgerpayment = this.dataModel['@id']
    console.log('form', form);
    this.apiDetail.create(form).subscribe({
      next: (res:any) => {
        // this.loadData();
        this.mainModel.list.push(res);
        this.filter(this.search);
        this.resetDetailForm();
        this.msg.success('Added successfully!');
        this.countTotal();
        this.cd.detectChanges();
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
        this.cd.detectChanges();
      }
    });
  }

  countTotal() {
    let amt: number = 0
    this.mainModel.list.map((d: any) => {
      amt += parseFloat(d.amount);
    })

    this.mainModel.totalAmount = amt;
    this.validateForm.patchValue({
      totalAmount: amt
    })
  }

  closeMe() {
    this.#modal.destroy({})
  }

  treeConstruct(treeData: any) {
    let constructedTree: any= [];
    for (let i of treeData) {
      let treeObj = i;
      let assigned = false;
      this.constructTree(constructedTree, treeObj, assigned)
    }
    return constructedTree;
  }

  constructTree(constructedTree: any, treeObj: any, assigned: any) {
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
    }
    else {
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
}
