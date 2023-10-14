import { Route } from '@angular/router';

export default [
  {
    path: '',
    data: { title: 'Inventory Period', key: 'default:inventory', breadcrumb: 'Inventory::List' },
    loadComponent: () => import('./inventory.component').then(c => c.InventoryComponent)
  },
  // {
  //   path: 'new',
  //   data: { title: 'New Issuance', key: 'default:issuance:new', breadcrumb: 'Issuance::new' },
  //   loadComponent: () => import('./new/new.component').then(c => c.NewComponent)
  // },
  {
    path: 'list',
    data: { title: 'Inventory Period', key: 'default:inventory:list', breadcrumb: 'Inventory::List' },
    loadComponent: () => import('./list/list.component').then(c => c.ListComponent)
  },
] as Route[];
