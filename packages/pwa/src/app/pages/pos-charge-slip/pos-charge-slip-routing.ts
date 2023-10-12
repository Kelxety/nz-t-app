import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'new', pathMatch: 'full' },
  {
    path: 'new',
    data: { title: 'POS', key: 'default:;pos:new', breadcrumb: 'POS::new' },
    loadComponent: () => import('./new/new.component').then(c => c.NewComponent)
  }
] as Route[];
