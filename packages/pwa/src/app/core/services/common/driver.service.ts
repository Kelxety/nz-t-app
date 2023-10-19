import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { driver } from 'driver.js';
/*
 * https://madewith.cn/766
 * 引导页
 * */
@Injectable({
  providedIn: 'root'
})
export class DriverService {
  constructor(@Inject(DOCUMENT) private doc: Document) {}

  load(): void {
    setTimeout(() => {
      const driverObj = driver({
        animate: false,
        allowClose: true,
        doneBtnText: 'Finish',
        nextBtnText: 'Next step',
        prevBtnText: 'Previous',
        onHighlightStarted: () => {
          this.doc.body.style.cssText = 'overflow:hidden';
        },
        steps: [
          {
            element: '#menuNav',
            popover: {
              title: 'Menu',
              description: 'Here is the menu',
              align: 'center'
            }
          },
          {
            element: '#drawer-handle',
            popover: {
              title: 'Theme settings button',
              description: 'Click to expand and set the theme, you can drag up and down',
              align: 'start'
            }
          },
          {
            element: '#tools',
            popover: {
              title: 'Toolbar',
              description: 'Lock screen, search menu, full screen, notification message, logout, multilingual',
              side: 'bottom'
            }
          },
          {
            element: '#chats',
            popover: {
              title: 'Contact administrator',
              description: 'Contact the administrator',
              side: 'top'
            }
          },
          {
            element: '#trigger',
            popover: {
              title: 'Collapse menu',
              description: 'Menu collapse',
              side: 'bottom'
            }
          },
          {
            element: '#multi-tab',
            popover: {
              title: 'multi-label',
              description: 'Right-click a single tab to expand multiple options, and scroll the mouse wheel to scroll through the tabs after the screen is exceeded',
              side: 'bottom'
            }
          },
          {
            element: '#multi-tab2',
            popover: {
              title: 'multi-label',
              description: 'Right-click a single tab to expand multiple options, and scroll the mouse wheel to scroll through the tabs after the screen is exceeded',
              side: 'bottom'
            }
          }
        ]
      });
      driverObj.drive();
    }, 500);
  }
}
