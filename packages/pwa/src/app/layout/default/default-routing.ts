import { Route } from '@angular/router';

import { JudgeAuthGuard } from '@core/services/common/guard/judgeAuth.guard';
import { JudgeLoginGuard } from '@core/services/common/guard/judgeLogin.guard';

import { DefaultComponent } from './default.component';

export default [
  {
    path: '',
    component: DefaultComponent,
    data: { shouldDetach: 'no', preload: true },
    canActivateChild: [JudgeLoginGuard, JudgeAuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        data: { preload: true },
        loadChildren: () => import('../../pages/dashboard/dashboard-routing')
      },
      {
        path: 'receiving',
        data: { title: 'Stock Receiving', key: 'receiving' },
        loadComponent: () => import('../../pages/receiving/receiving.component').then(m => m.ReceivingComponent)
      },
      {
        path: 'receiving-transaction-list',
        data: { title: 'Receiving Transaction List', key: 'receiving-transaction-list' },
        loadComponent: () => import('../../pages/receiving-transaction-list/receiving-transaction-list.component').then(m => m.ReceivingTransactionListComponent)
      },
      {
        path: 'price-update',
        data: { title: 'Price Update', key: 'price-update' },
        loadComponent: () => import('../../pages/price-update/price-update.component').then(m => m.PriceUpdateComponent)
      },
      {
        path: 'configuration',
        loadChildren: () => import('../../pages/configuration/configuration-routing')
      },
      {
        path: 'about',
        data: { title: 'About', key: 'about' },
        loadComponent: () => import('../../pages/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'system',
        loadChildren: () => import('../../pages/system/system-routing')
      }
    ]
  }
] as Route[];
