import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'account', pathMatch: 'full' },
  { path: 'tms_class', data: { title: 'RPT Classification', key: 'tmsClass' }, loadComponent: () => import('./feature/tms-class/tms-class.component').then(c => c.TmsClassComponent) },
  { path: 'tms_account', data: { title: 'Account', key: 'tmsAccount' }, loadComponent: () => import('./feature/tms-account/tms-account.component').then(c => c.TmsAccountComponent) },
  { path: 'location', data: { title: 'Location', key: 'location' }, loadComponent: () => import('./feature/location/location.component').then(c => c.LocationComponent) },
  { path: 'item-category', data: { title: 'Item Category', key: 'itemCategory', breadcrumb: 'Item Category' }, loadComponent: () => import('./feature/item-category/item-category.component').then(c => c.ItemCategoryComponent) },
  { path: 'item', data: { title: 'Item', key: 'item', breadcrumb: 'Item' }, loadComponent: () => import('./feature/item/item.component').then(c => c.ItemComponent) },
  { path: 'item-modal', data: { title: 'Item Modal', key: 'itemModal', breadcrumb: 'Item Modal' }, loadComponent: () => import('./feature/item/item-modal/item-modal.component').then(c => c.ItemModalComponent) },
] as Route[];