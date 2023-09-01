import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { LocationBarangayService, LocationMunicipalityService, LocationProvinceService, LocationRegionService } from '@app/shared/data-access/api';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

interface statusState {
  status: number;
  data: any;
}

@Component({
  selector: 'app-location-barangay-modal',
  templateUrl: './location-barangay-modal.component.html',
  styleUrls: ['./location-barangay-modal.component.less']
})
export class LocationBarangayModalComponent implements OnInit, AfterViewInit {
  @Input() actionType: string = 'create'; //create, edit, view, delete
  @Input() id: string = ''; // primary key
  @Input() municipality: string = ''; // primary key
  @Output() statusData: EventEmitter<statusState> = new EventEmitter();

  readonly #modal = inject(NzModalRef);
  readonly nzData: any = inject(NZ_MODAL_DATA);
  validateForm: UntypedFormGroup;
  dataModel: any = {};
  isLoading: boolean = false;

  constructor (
    private fb: UntypedFormBuilder,
    private apiService: LocationBarangayService,
    private msg: NzMessageService
  ) {
    this.id = this.nzData.id;
    this.actionType = this.nzData.actionType;
    this.municipality = this.nzData.municipality;

    this.validateForm = this.fb.group({
      municipality: [this.municipality, [Validators.required]],
      barangayCode: ['', [Validators.required]],
      barangayName: ['', [Validators.required]],
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
    this.validateForm.patchValue({municipality: this.municipality})
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
        this.dataModel = res;
        this.validateForm.patchValue({
          municipality: this.dataModel.municipality,
          barangayCode: this.dataModel.barangayCode,
          barangayName: this.dataModel.barangayName,
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
