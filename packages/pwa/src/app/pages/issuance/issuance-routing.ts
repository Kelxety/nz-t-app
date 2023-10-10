import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'new', pathMatch: 'full' },
  {
    path: 'new',
    data: { title: 'New Issuance', key: 'default:issuance:new', breadcrumb: 'Issuance::new' },
    loadComponent: () => import('./new/new.component').then(c => c.NewComponent)
  },
  {
    path: 'transactions',
    data: { title: 'Issuance Transactions', key: 'default:issuance:transactions', breadcrumb: 'Issuance::Transactions' },
    loadComponent: () => import('./list/list.component').then(c => c.ListComponent)
  },
  {
    path: 'transactions/:id',
    data: { title: 'Receive mode', key: 'default:configuration:receive-mode', breadcrumb: 'Issuance::/id' },
    loadComponent: () => import('./edit/edit.component').then(c => c.EditComponent)
  }
] as Route[];
