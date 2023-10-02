import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'dept', pathMatch: 'full' },
  { path: 'menu', data: { title: 'Menu management', key: 'menu' }, loadComponent: () => import('./menu/menu.component').then(m => m.MenuComponent) },
  { path: 'account', data: { title: 'Account management', key: 'account' }, loadComponent: () => import('./account/account.component').then(m => m.AccountComponent) },
  { path: 'dept', data: { title: 'Department management', key: 'dept' }, loadComponent: () => import('./dept/dept.component').then(m => m.DeptComponent) },
  { path: 'role-manager', loadChildren: () => import('./role-manager/role-manage-routing') }
] as Route[];
