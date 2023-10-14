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
        path: 'inventory',
        data: { title: 'Inventory Period', key: 'default:inventory' },
        loadChildren: () => import('../../pages/inventory/inventory-routing')
      },
      {
        path: 'receiving',
        data: { title: 'Stock Receiving', key: 'receiving' },
        loadComponent: () => import('../../pages/receiving/receiving.component').then(m => m.ReceivingComponent)
      },
      {
        path: 'receiving-transaction-list',
        data: { title: 'Receiving Transaction List', key: 'default:receiving-transaction-list' },
        loadComponent: () => import('../../pages/receiving-transaction-list/receiving-transaction-list.component').then(m => m.ReceivingTransactionListComponent)
      },
      {
        path: 'pos',
        data: { title: 'POS', key: 'default:pos' },
        loadChildren: () => import('../../pages/pos-charge-slip/pos-charge-slip-routing')
      },
      {
        path: 'issuance',
        data: { title: 'Stock-Issuance', key: 'default:issuance' },
        loadChildren: () => import('../../pages/issuance/issuance-routing')
      },
      {
        path: 'price-update',
        data: { title: 'Price Update', key: 'price-update' },
        loadComponent: () => import('../../pages/price-update/price-update.component').then(m => m.PriceUpdateComponent)
      },
      {
        path: 'item-inquiry',
        data: { title: 'Item Inquiry', key: 'item-inquiry' },
        loadComponent: () => import('../../pages/item-inquiry/item-inquiry.component').then(m => m.ItemInquiryComponent)
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
