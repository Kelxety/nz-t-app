import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { LocationBarangayService, LocationMunicipalityService, TmsRptClassService, TmsRptLedgerService } from '@app/shared/data-access/api';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

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
  selector: 'app-tms-rpt-ledger-modal',
  templateUrl: './tms-rpt-ledger-modal.component.html',
  styleUrls: ['./tms-rpt-ledger-modal.component.less']
})
export class TmsRptLedgerModalComponent implements OnInit, AfterViewInit {
  @Input() actionType: string = 'create'; //create, edit, view, delete
  @Input() id: string = ''; // primary key
  @Input() region: string = ''; // primary key
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

  classModel: dataModel = {
    list: [],
    filteredList: [],
    hasSelected: false,
    selected: {},
    isModalShow: false,
    isSubmitting: false,
    loading: true
  }

  rpuTypeList:any[] = [
    {
      name: 'Building',
      value: 'bldg'
    },
    {
      name: 'Land',
      value: 'land'
    },
    {
      name: 'Machine',
      value: 'mach'
    },
    {
      name: 'Plant/Tree',
      value: 'planttree'
    }
  ]

  txntypeList:any[] = [
    {
      name: 'CC',
      value: 'CC'
    },
    {
      name: 'CD',
      value: 'CD'
    },
    {
      name: 'CE',
      value: 'CE'
    },
    {
      name: 'CS',
      value: 'CS'
    },
    {
      name: 'DC',
      value: 'DC'
    },
    {
      name: 'GR',
      value: 'GR'
    },
    {
      name: 'ND',
      value: 'ND'
    },
    {
      name: 'RE',
      value: 'RE'
    },
    {
      name: 'RV',
      value: 'RV'
    },
    {
      name: 'SD',
      value: 'SD'
    },
    {
      name: 'TR',
      value: 'TR'
    },
  ]

  constructor (
    private cd: ChangeDetectorRef,
    private fb: UntypedFormBuilder,
    public apiService: TmsRptLedgerService,
    public apiClassification: TmsRptClassService,
    public apiMunicipality: LocationMunicipalityService,
    public apiBarangay: LocationBarangayService,
    private msg: NzMessageService
  ) {

    this.actionType = this.nzData.actionType;
    this.id = this.nzData.id;
    this.region = this.nzData.region;
    this.region = this.nzData.region;

    this.validateForm = this.fb.group({
      barangay:     [null, [Validators.required]],
      rptPin:       ['', [Validators.required]],
      tdn:          ['', [Validators.required]],
      cadastrallotno: ['', [Validators.required]],
      rputype:      ['', [Validators.required]],
      txntype:      ['', [Validators.required]],
      totalav:      ['', [Validators.required]],
      totalmv:      ['', [Validators.required]],
      totalareaha:  ['', [Validators.required]],
      taxable:      [true, [Validators.required]],
      ownerName:    ['', [Validators.required]],
      classification: [null, [Validators.required]],
      classificationName: ['', []],
      titleno:      ['', [Validators.required]],
      state:        [ true, []],
      remarks:      ['', []]
    });

    this.validateForm.controls['classification'].valueChanges.subscribe(value => {
      this.classModel.list.map((d:any) => {
        if(d['@id'] === value) {
          this.validateForm.patchValue({
            classificationName: d.className
          })
        }
      });
    });
  }

  ngOnInit() {
    this.loadClass();
    this.loadMunicipality();
    console.log('TYPE', this.actionType);
    if (this.actionType === 'edit' || this.actionType === 'delete' || this.actionType === 'view') {
      this.getData();
    } else {
      this.resetForm();
    }
  }

  ngAfterViewInit(): void {
    // const dig = (path = '0', level = 3): NzTreeNodeOptions[] => {
    //   const list = [];
    //   for (let i = 0; i < 10; i += 1) {
    //     const key = `${path}-${i}`;
    //     const treeNode: NzTreeNodeOptions = {
    //       title: key,
    //       key,
    //       expanded: true,
    //       children: [],
    //       isLeaf: false
    //     };

    //     if (level > 0) {
    //       treeNode.children = dig(key, level - 1);
    //       treeNode.selectable = false;
    //     } else {
    //       treeNode.isLeaf = true;
    //     }

    //     list.push(treeNode);
    //   }
    //   return list;
    // };

    // this.nodes = dig();
    this.validateForm.patchValue({region: this.region})
  }

  resetForm(): void {
    // e.preventDefault();
    this.validateForm.reset();
    this.validateForm.patchValue({
      state: true
    })

    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
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
        let tempData: NzTreeNodeOptions[] = [];

        this.municipalityModel.list.map((m:any) => {
          let children: NzTreeNodeOptions[] = [];
          list.map((b:any) => {
            if (m.key === b.municipality['@id']) {
              children.push({
                title: `${b.barangayName}`, 
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

  loadClass() {
    let model: any = this.classModel;
    model.loading = true;
    
    let order: any = [{
      sortColumn: 'className',
      sortDirection: 'asc'
    }];
    this.apiClassification.list({order: order, pagination: false}).subscribe({
      next: (res:any) => {
        const list = res['hydra:member'];
        model.list = list;
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
    this.apiService.get(this.id).subscribe({
      next: (res:any) => {
        this.dataModel = res;
        this.validateForm.patchValue({
          barangay: res.barangay['@id'],
          cadastrallotno: res.cadastrallotno,
          classification: res.classification, 
          classificationName: res.classificationName, 
          ownerName: res.ownerName,
          remarks: res.remarks,
          rptPin: res.rptPin,
          rputype: res.rputype,
          state: res.state,
          taxable: res.taxable,
          tdn: res.tdn,
          titleno: res.titleno,
          totalareaha: res.totalareaha,
          totalav: res.totalav,
          totalmv: res.totalmv,
          txntype: res.txntype
        });
        console.log('SSSSS', this.validateForm.value);
      },
      error: (error: any) => {
        this.statusData.emit({status:500, data:{}});
        console.log('EEEEE', error);
      },
      complete: () => {
        
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

    this.apiService.create(form).subscribe({
      next: (res:any) => {
        this.resetForm();
         this.msg.success('Added successfully!');
         this.statusData.emit({status: 200, data: res})
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
    this.apiService.update(this.id, this.validateForm.value).subscribe({
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

  closeMe() {
    this.#modal.destroy({})
  }

}
