import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'account', pathMatch: 'full' },
  // { path: 'tms_class', data: { title: 'RPT Classification', key: 'tmsClass' }, loadComponent: () => import('./feature/tms-class/tms-class.component').then(c => c.TmsClassComponent) },
  { path: 'tms_account', data: { title: 'Account', key: 'tmsAccount' }, loadComponent: () => import('./feature/tms-account/tms-account.component').then(c => c.TmsAccountComponent) },
  { path: 'location', data: { title: 'Location', key: 'location' }, loadComponent: () => import('./feature/location/location.component').then(c => c.LocationComponent) },
  {
    path: 'item-category',
    data: { title: 'Item Category', key: 'default:configuration:item-category', breadcrumb: 'Item Category' },
    loadComponent: () => import('./feature/item-category/item-category.component').then(c => c.ItemCategoryComponent)
  },
  { path: 'item', data: { title: 'Item', key: 'item', breadcrumb: 'Item' }, loadComponent: () => import('./feature/item/item.component').then(c => c.ItemComponent) },
  {
    path: 'item-modal',
    data: { title: 'Add Item', key: 'default:configuration:item-modal', breadcrumb: 'Add Item' },
    loadComponent: () => import('./feature/item/item-modal/item-modal.component').then(c => c.ItemModalComponent)
  },
  {
    path: 'item-edit-modal/:id',
    data: { title: 'Edit Item', key: 'default:configuration:item-edit-modal', breadcrumb: 'Edit Item' },
    loadComponent: () => import('./feature/item/item-edit-modal/item-edit-modal.component').then(c => c.ItemEditModalComponent)
  },
  {
    path: 'unit',
    data: { title: 'Unit', key: 'default:configuration:unit', breadcrumb: 'Unit' },
    loadComponent: () => import('./feature/unit/unit.component').then(c => c.UnitComponent)
  },
  {
    path: 'warehouse',
    data: { title: 'Warehouse', key: 'default:configuration:warehouse', breadcrumb: 'Warehouse' },
    loadComponent: () => import('./feature/warehouse/warehouse.component').then(c => c.WarehouseComponent)
  },
  {
    path: 'supplier',
    data: { title: 'Supplier', key: 'default:configuration:supplier', breadcrumb: 'Supplier' },
    loadComponent: () => import('./feature/supplier/supplier.component').then(c => c.SupplierComponent)
  },
  {
    path: 'receive-mode',
    data: { title: 'Receive mode', key: 'default:configuration:receive-mode', breadcrumb: 'Receive mode' },
    loadComponent: () => import('./feature/receive-mode/receive-mode.component').then(c => c.ReceiveModeComponent)
  },
  {
    path: 'patient-type',
    data: { title: 'Patient Type', key: 'default:configuration:patient-type', breadcrumb: 'Patient type' },
    loadComponent: () => import('./feature/patient-type/patient-type.component').then(c => c.PatientTypeComponent)
  },
  {
    path: 'physician',
    data: { title: 'Physician', key: 'default:configuration:physician', breadcrumb: 'Physician' },
    loadComponent: () => import('./feature/physician/physician.component').then(c => c.PhysicianComponent)
  }
] as Route[];
