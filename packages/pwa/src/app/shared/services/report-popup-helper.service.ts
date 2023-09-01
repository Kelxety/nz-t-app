import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportPopupHelperService {

    constructor() { }

    public popupCenter(url: string, title: string, w: number, h: number) {
        // Fixes dual-screen position                         Most browsers      Firefox

        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : 0;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : 0;
        let width = 0;
        let height = 0;

        width = window.innerWidth ? window.innerWidth :
          document.documentElement.clientWidth ? 
            document.documentElement.clientWidth : screen.width;
        height = window.innerHeight ? window.innerHeight :
          document.documentElement.clientHeight ? 
            document.documentElement.clientHeight : screen.height;

        const left = ((width / 2) - (w / 2)) + dualScreenLeft;
        const top = ((height / 2) - (h / 2)) + dualScreenTop;
        const newWindow: any = window.open(url, title,
          'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

        
        newWindow.focus();
        
    }
}
