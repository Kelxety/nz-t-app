import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { LocationMunicipalityService, LocationProvinceService, LocationRegionService } from '@app/shared/data-access/api';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

interface statusState {
  status: number;
  data: any;
}

@Component({
  selector: 'app-location-municipality-modal',
  templateUrl: './location-municipality-modal.component.html',
  styleUrls: ['./location-municipality-modal.component.less']
})
export class LocationMunicipalityModalComponent implements OnInit, AfterViewInit {
  @Input() actionType: string = 'create'; //create, edit, view, delete
  @Input() id: string = ''; // primary key
  @Input() province: string = ''; // primary key
  @Output() statusData: EventEmitter<statusState> = new EventEmitter();

  readonly #modal = inject(NzModalRef);
  readonly nzData: any = inject(NZ_MODAL_DATA);
  validateForm: UntypedFormGroup;
  dataModel: any = {};
  isLoading: boolean = false;

  constructor (
    private fb: UntypedFormBuilder,
    private apiService: LocationMunicipalityService,
    private msg: NzMessageService
  ) {
    this.id = this.nzData.id;
    this.actionType = this.nzData.actionType;
    this.province = this.nzData.province;
    console.log('ID: ', this.id);
    console.log('actionType: ', this.actionType);
    console.log('province: ', this.province);

    this.validateForm = this.fb.group({
      province: [this.province, [Validators.required]],
      municipalityCode: ['', [Validators.required]],
      municipalityName: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      district: ['1', [Validators.required]],
      state: [ true, [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.actionType === 'edit' || this.actionType === 'delete' || this.actionType === 'view') {
      this.getData();
    } else {
      this.resetForm();
    }

  }

  ngAfterViewInit(): void {
    this.validateForm.patchValue({province: this.province})
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

  getData() {
    this.apiService.get(this.id).subscribe({
      next: (res:any) => {
        console.log('RES', res);
        this.dataModel = res;
        this.validateForm.patchValue({
          province: this.dataModel.province,
          municipalityCode: this.dataModel.municipalityCode,
          municipalityName: this.dataModel.municipalityName,
          zipcode: this.dataModel.zipcode,
          district: this.dataModel.district,
          state: this.convertStatus(this.dataModel.state),
        })
        console.log(this.dataModel);
      },
      error: (error: any) => {
        this.statusData.emit({status:500, data:{}});
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
        console.log('eeeeerrrr', error);
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
