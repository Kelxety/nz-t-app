import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SpinService } from '@app/core/services/store/common-store/spin.service';
import { SharedModule } from '@app/shared';
import { LocationBarangayService, LocationMunicipalityService, LocationProvinceService, LocationRegionService } from '@app/shared/data-access/api';
import { LocationBarangayModalComponent } from '@app/shared/feature/location-barangay-modal/location-barangay-modal.component';
import { LocationMunicipalityModalComponent } from '@app/shared/feature/location-municipality-modal/location-municipality-modal.component';
import { LocationProvinceModalComponent } from '@app/shared/feature/location-province-modal/location-province-modal.component';
import { LocationRegionComponent } from '@app/shared/feature/location-region/location-region.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Subject, forkJoin, takeUntil } from 'rxjs';

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
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SharedModule,
    NzSelectModule
  ],
})
export class LocationComponent implements OnInit {
  private ngUnsubscribe = new Subject();

  regionModel: dataModel = {
    list: [],
    filteredList: [],
    hasSelected: false,
    selected: {},
    isModalShow: false,
    isSubmitting: false,
    loading: true
  }

  provinceModel: dataModel = {
    list: [],
    filteredList: [],
    hasSelected: false,
    selected: {},
    isModalShow: false,
    isSubmitting: false,
    loading: true
  }

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

  constructor (
    private cd: ChangeDetectorRef,
    public apiRegion: LocationRegionService,
    public apiProvince: LocationProvinceService,
    public apiMunicipality: LocationMunicipalityService,
    public apiBarangay: LocationBarangayService,
    private spinService: SpinService,
    private modalService: NzModalService,
    private msg: NzMessageService,
    public dialog: MatDialog,
  ) 
  {
    this.spinService.setCurrentGlobalSpinStore(true);
  };
  
  ngOnInit() {
    this.loadRegion();
    this.loadProvince();
    this.loadMunicipality();
    this.loadBarangay();
    this.spinService.setCurrentGlobalSpinStore(false);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next({});
    this.ngUnsubscribe.complete();
  }

  loadRegion() {
    let model: any = this.regionModel;
    model.loading = true;
    
    let order: any = [{
      sortColumn: 'regionName',
      sortDirection: 'asc'
    }];

    this.apiRegion.list({order: order, pagination: false}).subscribe({
      next: (res:any) => {
        const list = res['hydra:member'];
        let tempData: any = [];
        list.map((x:any) => {
          let act: boolean = false;
          if (x['@id'] === model.selected.value) { act = true; }
          tempData.push({name: `${x.regionName} - ${x.regionCode}`, value: x['@id'], active: act});
        })
        model.list = tempData;
        model.filteredList = model.list;
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

  loadProvince() {
    let model: any = this.provinceModel;
    model.loading = true;

    let order: any = [{
      sortColumn: 'provinceName',
      sortDirection: 'asc'
    }];

    this.provinceModel.loading = true;
    this.apiProvince.list({order: order, pagination: false}).subscribe({
      next: (res:any) => {
        const list = res['hydra:member'];
        let tempData: any = [];
        list.map((x:any) => {
          let act: boolean = false;
          if (x['@id'] === model.selected.value) { act = true; }
          tempData.push({name: `${x.provinceName} - ${x.provinceCode}`, value: x['@id'], active: act, key: x.region});
        })
        model.list = tempData;
        model.filteredList = model.list;
        this.selectProvince(this.provinceModel.selected);
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
        const list = res['hydra:member'];
        let tempData: any = [];
        list.map((x:any) => {
          tempData.push({name: `${x.municipalityName} - ${x.municipalityCode}`, value: x['@id'], active: false, key: x.province});
        })
        this.municipalityModel.list = tempData;
        console.log('MUNI', this.municipalityModel.list);
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
        let tempData: any = [];
        list.map((x:any) => {
          tempData.push({name: x.barangayName, value: x['@id'], active: false, key: x.municipality['@id']});
        })
        this.barangayModel.list = tempData;
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

  reloadRegion() {
    this.loadRegion();
  }

  reloadProvince() {
    this.loadProvince();
  }

  reloadMunicipality() {
    this.loadMunicipality();
  }

  reloadBarangay() {
    this.loadBarangay();
  }

  selectItem(p:any, f:any, d: any) { //p: primary model, f: foreignkey model, d: $event
    let model: any = p;
    let modelF: any = f;
    model.selected = d;
    
    let tempData: any = [];
    modelF.list.map((x: any) => {
      x.active = false;
      if (x.key === model.selected.value) {
        tempData.push(x);
      }
    });

    modelF.filteredList = tempData;
    this.cd.detectChanges();
    return modelF.filteredList;
  }

  selectRegion(d: any) {
    let newData: any = this.selectItem(this.regionModel, this.provinceModel, d);
    if (newData.length > 0) {

    } else {

    }

    this.provinceModel.selected = {};
    this.municipalityModel.filteredList = [];
    this.municipalityModel.selected = {};
    this.barangayModel.filteredList = [];
    this.barangayModel.selected = {};
    this.cd.detectChanges();
  }

  selectProvince(d: any) {
    let count: number = this.selectItem(this.provinceModel, this.municipalityModel, d);
    if (count > 0) {
    } else {
    }
    
    this.municipalityModel.selected = {};
    this.barangayModel.filteredList = [];
    this.barangayModel.selected = {};
    this.cd.detectChanges();
  }

  selectMunicipality(d: any) {
    let count: number = this.selectItem(this.municipalityModel, this.barangayModel, d);
    if (count > 0) {

    } else {
      
    }
    this.cd.detectChanges();
  }

  selectBarangay(d: any) {

  }

  regionAction(actionType: string, data: any) {
    let model: any = this.regionModel;

    if (actionType === 'create') {
      const dialogRef = this.modalService.create({
        nzTitle: 'Add Region',
        nzContent: LocationRegionComponent,
        nzData: {
          actionType: 'create'
        },
      });

      dialogRef.componentInstance?.statusData.subscribe(
        ($e) => {
          this.loadRegion();
          this.cd.detectChanges();
        },
      ); 

    } else if (actionType === 'edit') {
      const temp: string = data.value.replace(`${this.apiRegion.baseUrl}/`, '');
      const dialogRef = this.modalService.create({
        nzTitle: 'Edit Region',
        nzContent: LocationRegionComponent,
        nzData: {
          actionType: 'edit',
          id: temp
        },
      });

      dialogRef.componentInstance?.statusData.subscribe(
        ($e) => {
          const result:any = $e;
          if (result.status === 200) {
            if(result.data.state === 'Active') { result.data.state = true } else {result.data.state = false};
            const data: any = {name: `${result.data.regionName} - ${result.data.regionCode}`, value: result.data['@id'], active: true};
            this.loadRegion();
            this.selectRegion(data);
            this.cd.detectChanges();

          } else {
            console.log('EEEEEEEEEEEEEEEEEEe');
          }

          this.cd.detectChanges();
        }
      );  
    } else if (actionType === 'view') {
      const dialogRef = this.modalService.create({
        nzTitle: 'Region',
        nzContent: LocationRegionComponent,
        nzData: {
          actionType: 'view'
        },
      }); 
    } else if (actionType === 'delete') {
      const dialogRef = this.modalService.create({
        nzTitle: 'Region',
        nzContent: LocationRegionComponent,
        nzData: {
          actionType: 'view'
        },
      }); 
      dialogRef.componentInstance?.statusData.subscribe(
        ($e) => {
          
        },
      ); 
    }

  }

  provinceAction(actionType: string, data: any) {
    let model: any = this.provinceModel;

    if (actionType === 'create') {
      const dialogRef = this.modalService.create({
        nzTitle: `Add Province of ${this.regionModel.selected.name}`,
        nzContent: LocationProvinceModalComponent,
        nzData: {
          actionType: 'create',
          region: this.regionModel.selected.value
        },
      });

      dialogRef.componentInstance?.statusData.subscribe(
        ($e) => {
          this.loadProvince();
          this.cd.detectChanges();
        },
      ); 

    } else if (actionType === 'edit') {
      const temp: string = data.value.replace(`${this.apiProvince.baseUrl}/`, '');
      const dialogRef = this.modalService.create({
        nzTitle: `Edit Province of ${this.regionModel.selected.name}`,
        nzContent: LocationProvinceModalComponent,
        nzData: {
          actionType: 'edit',
          id: temp,
          region: this.regionModel.selected.value
        },
      });

      dialogRef.componentInstance?.statusData.subscribe(
        ($e) => {
          const result:any = $e;
          if (result.status === 200) {
            if(result.data.state === 'Active') { result.data.state = true } else {result.data.state = false};
            const data: any = {name: `${result.data.regionName} - ${result.data.regionCode}`, value: result.data['@id'], active: true};
            this.loadRegion();
            this.cd.detectChanges();

          } else {
            console.log('EEEEEEEEEEEEEEEEEEe');
          }

          this.cd.detectChanges();
        }
      );  
    } else if (actionType === 'view') {
      const dialogRef = this.modalService.create({
        nzTitle: 'Region',
        nzContent: LocationRegionComponent,
        nzData: {
          actionType: 'view'
        },
      }); 
    } else if (actionType === 'delete') {
      const dialogRef = this.modalService.create({
        nzTitle: 'Region',
        nzContent: LocationRegionComponent,
        nzData: {
          actionType: 'view'
        },
      }); 
      dialogRef.componentInstance?.statusData.subscribe(
        ($e) => {
          
        },
      ); 
    }

  }

  municipalityAction(actionType: string, data: any) {
    let model: any = this.municipalityModel;
    let modal = LocationMunicipalityModalComponent;
    const title: string = 'Municipality';

    if (actionType === 'create') {
      const dialogRef = this.modalService.create({
        nzTitle: `Add ${title} of ${this.regionModel.selected.name}`,
        nzContent: modal,
        nzData: {
          actionType: 'create',
          province: this.provinceModel.selected.value
        },
      });

      dialogRef.componentInstance?.statusData.subscribe(
        ($e) => {
          this.loadProvince();
          this.cd.detectChanges();
        },
      ); 

    } else if (actionType === 'edit') {
      const temp: string = data.value.replace(`${this.apiMunicipality.baseUrl}/`, '');
      const dialogRef = this.modalService.create({
        nzTitle: `Edit ${title} of ${this.provinceModel.selected.name}`,
        nzContent: modal,
        nzData: {
          actionType: 'edit',
          id: temp,
          province: this.provinceModel.selected.value
        },
      });

      dialogRef.componentInstance?.statusData.subscribe(
        ($e) => {
          const result:any = $e;
          if (result.status === 200) {
            if(result.data.state === 'Active') { result.data.state = true } else {result.data.state = false};
            const data: any = {name: `${result.data.regionName} - ${result.data.regionCode}`, value: result.data['@id'], active: true};
            this.loadRegion();
            this.cd.detectChanges();

          } else {
            console.log('EEEEEEEEEEEEEEEEEEe');
          }

          this.cd.detectChanges();
        }
      );  
    } else if (actionType === 'view') {
      const dialogRef = this.modalService.create({
        nzTitle: 'Region',
        nzContent: modal,
        nzData: {
          actionType: 'view'
        },
      }); 
    } else if (actionType === 'delete') {
      const dialogRef = this.modalService.create({
        nzTitle: 'Region',
        nzContent: modal,
        nzData: {
          actionType: 'view'
        },
      }); 
      dialogRef.componentInstance?.statusData.subscribe(
        ($e) => {
          
        },
      ); 
    }

  }

  barangayAction(actionType: string, data: any) {
    let model: any = this.barangayModel;
    let modal = LocationBarangayModalComponent;
    const title: string = 'Barangay';

    if (actionType === 'create') {
      const dialogRef = this.modalService.create({
        nzTitle: `Add ${title} of ${this.municipalityModel.selected.name}`,
        nzContent: modal,
        nzData: {
          actionType: 'create',
          municipality: this.municipalityModel.selected.value
        },
      });

      dialogRef.componentInstance?.statusData.subscribe(
        ($e) => {
          this.reloadBarangay();
          this.reloadMunicipality();
          this.cd.detectChanges();
        },
      ); 

    } else if (actionType === 'edit') {
      const temp: string = data.value.replace(`${this.apiBarangay.baseUrl}/`, '');
      const dialogRef = this.modalService.create({
        nzTitle: `Edit ${title} of ${this.regionModel.selected.name}`,
        nzContent: modal,
        nzData: {
          actionType: 'edit',
          id: temp,
          municipality: this.municipalityModel.selected.value
        },
      });

      dialogRef.componentInstance?.statusData.subscribe(
        ($e) => {
          const result:any = $e;
          if (result.status === 200) {
            if(result.data.state === 'Active') { result.data.state = true } else {result.data.state = false};
            const data: any = {name: `${result.data.regionName} - ${result.data.regionCode}`, value: result.data['@id'], active: true};
            this.loadRegion();
            this.selectRegion(data);
            this.cd.detectChanges();

          } else {
            console.log('EEEEEEEEEEEEEEEEEEe');
          }

          this.cd.detectChanges();
        }
      );  
    } else if (actionType === 'view') {
      const dialogRef = this.modalService.create({
        nzTitle: 'Region',
        nzContent: modal,
        nzData: {
          actionType: 'view'
        },
      }); 
    } else if (actionType === 'delete') {
      const dialogRef = this.modalService.create({
        nzTitle: 'Region',
        nzContent: modal,
        nzData: {
          actionType: 'view'
        },
      }); 
      dialogRef.componentInstance?.statusData.subscribe(
        ($e) => {
          
        },
      ); 
    }

  }

  delete(p: any, a: any, data: any): void { // p: primary model, a: api service, data: row to delete
    let model: any = p;
    let api: any = a;
    const id = data.value.replace(`${a.baseUrl}/`, '');
    const load = this.msg.loading('Removing in progress..', { nzDuration: 0 }).messageId;

    a.delete(id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: () => {
        model.filteredList = model.filteredList.filter((item: any) => item.value !== data.value);
        model.list = model.list.filter((item: any) => item.value !== data.value);
        
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
}
