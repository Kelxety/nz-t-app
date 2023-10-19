import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'account', pathMatch: 'full' },
  {
    path: 'warehouse',
    data: { title: 'Warehouse', key: 'default:configuration:warehouse', breadcrumb: 'Warehouse' },
    loadComponent: () => import('./feature/warehouse/warehouse.component').then(c => c.WarehouseComponent)
  }
  // {
  //   path: 'office',
  //   data: { title: 'Office', key: 'default:configuration:office', breadcrumb: 'Office' },
  //   loadComponent: () => import('./feature/office/office.component').then(c => c.OfficeComponent)
  // }
] as Route[];
