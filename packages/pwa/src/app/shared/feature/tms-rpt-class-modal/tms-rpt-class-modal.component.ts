import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { LocationRegionService, TmsRptClassService } from '@app/shared/data-access/api';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

interface statusState {
  status: number;
  data: any;
}

@Component({
  selector: 'app-tms-rpt-class-modal',
  templateUrl: './tms-rpt-class-modal.component.html',
  styleUrls: ['./tms-rpt-class-modal.component.less']
})
export class TmsRptClassModalComponent {
  validateForm: UntypedFormGroup;
  @Input() id: string = ''; // primary key
  @Input() actionType: string = '';
  @Output() statusData: EventEmitter<statusState> = new EventEmitter();

  readonly #modal = inject(NzModalRef);
  readonly nzData: any = inject(NZ_MODAL_DATA);

  dataModel: any = {};
  isLoading: boolean = false;


  constructor (
    private fb: UntypedFormBuilder,
    private apiService: TmsRptClassService,
    private msg: NzMessageService
  ) {
    this.id = this.nzData.id;
    this.actionType = this.nzData.actionType;

    this.validateForm = this.fb.group({
      classCode: ['', [Validators.required]],
      className: ['', [Validators.required]],
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

  submitForm() {
    this.submitCreate();
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
          classCode: res.classCode,
          className: res.className,
          state: res.state
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
  
  submitDelete() {

  }

  closeMe() {
    this.#modal.destroy({})
  }
}
