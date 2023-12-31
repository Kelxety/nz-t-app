import { InjectionToken } from '@angular/core';

import { Menu } from '@core/services/types';

export const MENU_TOKEN = new InjectionToken<Menu[]>('menu-token', {
  providedIn: 'root',
  factory(): Menu[] {
    return menuNav;
  }
});

const menuNav: Menu[] = [
  {
    id: 1,
    menuName: 'Dashboard',
    code: 'default:dashboard',
    fatherId: 0,
    path: '/default/dashboard',
    menuType: 'C',
    icon: 'dashboard',
    alIcon: '',
    selected: true,
    open: true,
    children: [
      {
        id: 40,
        menuName: 'Analysis',
        code: 'default:dashboard:analysis',
        fatherId: 1,
        path: '/default/dashboard/analysis',
        menuType: 'C',
        icon: 'fund',
        alIcon: '',
        selected: true,
        open: true
      },
      {
        id: 41,
        menuName: 'Monitor',
        code: 'default:dashboard:monitor',
        fatherId: 1,
        path: '/default/dashboard/monitor',
        menuType: 'C',
        icon: 'fund',
        selected: false,
        open: false
      }
    ]
  },
  {
    id: 2,
    menuName: 'Stock Receiving',
    // code: 'default:receiving',
    fatherId: 0,
    path: '/default/receiving',
    menuType: 'C',
    icon: 'stock',
    alIcon: '',
    selected: false,
    open: false
  },
  {
    id: 2,
    menuName: 'Price Update',
    // code: 'default:receiving',
    fatherId: 0,
    path: '/default/price-update',
    menuType: 'C',
    icon: 'stock',
    alIcon: '',
    selected: false,
    open: false
  },
  {
    id: 120,
    menuName: 'Configuration',
    // "code": "manage_configuration",
    fatherId: 0,
    path: '/default/configuration',
    menuType: 'C',
    icon: 'setting',
    selected: false,
    open: false,

    children: [
      // {
      //   id: 121,
      //   menuName: 'Classification',
      //   // "code": "manage_tms_class",
      //   fatherId: 113,
      //   path: '/default/configuration/tms_class',
      //   menuType: 'C',
      //   icon: 'menu',
      //   selected: false,
      //   open: false
      // },
      {
        id: 2,
        menuName: 'Item',
        // "code": "manage_tms_class",
        fatherId: 113,
        path: '/default/configuration/item',
        menuType: 'C',
        icon: 'menu',
        selected: false,
        open: false
      },
      {
        id: 3,
        menuName: 'Item Category',
        // "code": "manage_tms_class",
        fatherId: 113,
        path: '/default/configuration/item-category',
        menuType: 'C',
        icon: 'menu',
        selected: false,
        open: false
      },
      {
        id: 3,
        menuName: 'Unit',
        // "code": "manage_tms_class",
        fatherId: 113,
        path: '/default/configuration/unit',
        menuType: 'C',
        icon: 'menu',
        selected: false,
        open: false
      },
      {
        id: 4,
        menuName: 'Warehouse',
        // "code": "manage_tms_class",
        fatherId: 113,
        path: '/default/configuration/warehouse',
        menuType: 'C',
        icon: 'menu',
        selected: false,
        open: false
      },
      {
        id: 4,
        menuName: 'Supplier',
        // "code": "manage_tms_class",
        fatherId: 113,
        path: '/default/configuration/supplier',
        menuType: 'C',
        icon: 'menu',
        selected: false,
        open: false
      },
      {
        id: 4,
        menuName: 'Receive mode',
        // "code": "manage_tms_class",
        fatherId: 113,
        path: '/default/configuration/receive-mode',
        menuType: 'C',
        icon: 'menu',
        selected: false,
        open: false
      }
    ]
  },
  {
    id: 120,
    menuName: 'System Management',
    code: 'default:system',
    fatherId: 0,
    path: '/default/system',
    menuType: 'C',
    icon: 'menu',
    alIcon: '',
    selected: false,
    open: false,
    children: [
      {
        id: 121,
        menuName: 'Account Management',
        code: 'default:system:account',
        fatherId: 120,
        path: '/default/system/account',
        menuType: 'C',
        icon: 'menu',
        alIcon: '',
        selected: false,
        open: false
      },
      {
        id: 122,
        menuName: 'Role Management',
        code: 'default:system:role-manager',
        fatherId: 120,
        path: '/default/system/role-manager',
        menuType: 'C',
        icon: '',
        alIcon: 'icon-mel-help',
        selected: false,
        open: false
      },
      {
        id: 123,
        menuName: 'Menu Management',
        code: 'default:system:menu',
        fatherId: 120,
        path: '/default/system/menu',
        menuType: 'C',
        icon: 'menu',
        alIcon: '',
        selected: false,
        open: false
      },
      {
        id: 124,
        menuName: 'Department Management',
        code: 'default:system:dept',
        fatherId: 120,
        path: '/default/system/dept',
        menuType: 'C',
        icon: '',
        alIcon: 'icon-mel-help',
        selected: false,
        open: false
      }
    ]
  }
];
