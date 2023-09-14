import { NgTemplateOutlet, NgIf } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { WindowService } from '@core/services/common/window.service';
import { ResType } from '@pwa/src/app/utils/types/return-types';
import { AccountService, UserPsd } from '@services/system/account.service';
import { ScreenLessHiddenDirective } from '@shared/directives/screen-less-hidden.directive';
import { ToggleFullscreenDirective } from '@shared/directives/toggle-fullscreen.directive';
import { SpinService } from '@store/common-store/spin.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { ModalBtnStatus } from '@widget/base-modal';
import { ChangePasswordService } from '@widget/biz-widget/change-password/change-password.service';
import { LockWidgetService } from '@widget/common-widget/lock-widget/lock-widget.service';
import { SearchRouteService } from '@widget/common-widget/search-route/search-route.service';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { HomeNoticeComponent } from '../home-notice/home-notice.component';

@Component({
  selector: 'app-layout-head-right-menu',
  templateUrl: './layout-head-right-menu.component.html',
  styleUrls: ['./layout-head-right-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    ScreenLessHiddenDirective,
    NzToolTipModule,
    NzIconModule,
    NzButtonModule,
    ToggleFullscreenDirective,
    NgIf,
    NzDropDownModule,
    NzBadgeModule,
    NzMenuModule,
    HomeNoticeComponent
  ]
})
export class LayoutHeadRightMenuComponent implements OnInit {
  user!: UserPsd;

  changePassForm = this.fb.group({
    id: ['', [Validators.required]],
    oldPassword: [null, [Validators.required]],
    newPassword: [null, [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private router: Router,
    private changePasswordModalService: ChangePasswordService,
    private spinService: SpinService,
    private loginOutService: LoginInOutService,
    private lockWidgetService: LockWidgetService,
    private windowServe: WindowService,
    private activatedRoute: ActivatedRoute,
    private searchRouteService: SearchRouteService,
    public message: NzMessageService,
    public userInfoService: UserInfoService,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {}

  lockScreen(): void {
    this.lockWidgetService
      .show({
        nzTitle: 'Lock screen',
        nzStyle: { top: '25px' },
        nzWidth: '520px',
        nzFooter: null,
        nzMaskClosable: true
      })
      .subscribe();
  }

  changePassWorld(): void {
    this.changePasswordModalService.show({ nzTitle: 'Change Password' }).subscribe(({ modalValue, status }) => {
      if (status === ModalBtnStatus.Cancel) {
        return;
      }
      this.loginOutService.getMe().subscribe(res => {
        this.user = {
          id: res.id,
          oldPassword: modalValue.oldPassword,
          newPassword: modalValue.newPassword
        };

        this.changePassForm.setValue({
          id: res.id,
          oldPassword: modalValue.oldPassword,
          newPassword: modalValue.newPassword
        });
        this.accountService.editAccountPsd(this.changePassForm.getRawValue()).subscribe({
          next: (res: any) => {
            console.log(res);
            if (res.statusCode === 200) {
              this.loginOutService.loginOut().then();
              this.message.success('Modified successfully, please log in again');
            } else if (res.statusCode === 401) {
              this.message.warning('Invalid Credentials!');
            } else {
              this.message.warning(res.error);
            }
          }
        });
      });
    });
  }

  showSearchModal(): void {
    const modalOptions: ModalOptions = {
      nzClosable: false,
      nzMaskClosable: true,
      nzStyle: { top: '48px' },
      nzFooter: null,
      nzBodyStyle: { padding: '0' }
    };
    this.searchRouteService.show(modalOptions);
  }

  goLogin(): void {
    this.loginOutService.loginOut().then();
  }

  clean(): void {
    this.windowServe.clearStorage();
    this.windowServe.clearSessionStorage();
    this.loginOutService.loginOut().then();
    this.message.success('Cleared successfully, please log in again');
  }

  showMessage(): void {
    this.message.info('switch successfully');
  }

  goPage(path: string): void {
    this.router.navigateByUrl(`/default/page-demo/personal/${path}`);
  }

  ngOnInit(): void {}
}
