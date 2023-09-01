import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import Driver from 'driver.js';
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
      const driver = new Driver({
        animate: false,
        allowClose: true,
        doneBtnText: 'Finish',
        closeBtnText: 'Close',
        nextBtnText: 'Next step',
        prevBtnText: 'Previous',
        onHighlightStarted: () => {
          this.doc.body.style.cssText = 'overflow:hidden';
        },
        onReset: () => {
          this.doc.body.style.cssText = '';
        }
      });
      driver.defineSteps([
        {
          element: '#menuNav',
          popover: {
            title: 'Menu',
            description: 'Here is the menu',
            position: 'right-center'
          }
        },
        {
          element: '#drawer-handle',
          popover: {
            title: 'Theme settings button',
            description: 'Click to expand and set the theme, you can drag up and down',
            position: 'left'
          }
        },
        {
          element: '#tools',
          popover: {
            title: 'Toolbar',
            description: 'Lock screen, search menu, full screen, notification message, logout, multilingual',
            position: 'bottom'
          }
        },
        {
          element: '#chats',
          popover: {
            title: 'Contact administrator',
            description: 'Contact the administrator',
            position: 'top'
          }
        },
        {
          element: '#trigger',
          popover: {
            title: 'Collapse menu',
            description: 'Menu collapse',
            position: 'bottom'
          }
        },
        {
          element: '#multi-tab',
          popover: {
            title: 'multi-label',
            description: 'Right-click a single tab to expand multiple options, and scroll the mouse wheel to scroll through the tabs after the screen is exceeded',
            position: 'bottom'
          }
        },
        {
          element: '#multi-tab2',
          popover: {
            title: 'multi-label',
            description: 'Right-click a single tab to expand multiple options, and scroll the mouse wheel to scroll through the tabs after the screen is exceeded',
            position: 'bottom'
          }
        }
      ]);
      driver.start();
    }, 500);
  }
}
