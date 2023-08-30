import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'account', pathMatch: 'full' },
  { path: 'tms_class', data: { title: 'RPT Classification', key: 'tmsClass' }, loadComponent: () => import('./feature/tms-class/tms-class.component').then(c => c.TmsClassComponent) },
  { path: 'tms_account', data: { title: 'Account', key: 'tmsAccount' }, loadComponent: () => import('./feature/tms-account/tms-account.component').then(c => c.TmsAccountComponent) },
  { path: 'location', data: { title: 'Location', key: 'location' }, loadComponent: () => import('./feature/location/location.component').then(c => c.LocationComponent) },
  { path: 'item-category', data: { title: 'Item Category', key: 'itemCategory' }, loadComponent: () => import('./feature/item-category/item-category.component').then(c => c.ItemCategoryComponent) },
] as Route[];