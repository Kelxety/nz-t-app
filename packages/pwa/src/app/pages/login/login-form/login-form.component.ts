import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { filter, finalize } from 'rxjs/operators';

import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { WindowService } from '@core/services/common/window.service';
import { LoginService } from '@core/services/http/login/login.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { SpinService } from '@store/common-store/spin.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { fnCheckForm } from '@utils/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, NzFormModule, ReactiveFormsModule, NzTabsModule, NzGridModule, NzButtonModule, NzInputModule, NzWaveModule, NzCheckboxModule, NzIconModule, RouterLink, NzNotificationModule]
})
export class LoginFormComponent implements OnInit {
  validateForm!: FormGroup;

  loginForm = this.fb.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required]],
    _channel: ['web.client', [Validators.required]],
    remember: [null]
  });

  destroyRef = inject(DestroyRef);
  constructor(
    private fb: FormBuilder,
    private loginInOutService: LoginInOutService,
    private menuService: MenuStoreService,
    private dataService: LoginService,
    private spinService: SpinService,
    private windowServe: WindowService,
    private userInfoService: UserInfoService,
    private notification: NzNotificationService,
    private router: Router
  ) {}

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  submitForm(): void {
    // Validate the form
    if (!fnCheckForm(this.loginForm)) {
      return;
    }
    // set global loading
    this.spinService.setCurrentGlobalSpinStore(true);
    // Get the value of the form
    const param = this.loginForm.getRawValue();
    // Call the login interface
    // The todo login background returns a unified mode. If the code is not 0, it will be automatically blocked. If you need to modify it, please modify it in src/app/core/services/http/base-http.service.ts
    // {
    //   code:number,
    //   data:any,
    //   msg：string
    // }
    this.dataService
      .login(param)
      .pipe(
        // Set global loading to false anyway
        finalize(() => {
          this.spinService.setCurrentGlobalSpinStore(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(userToken => {
        // After the background login here is successful, only a set of token encrypted by jwt will be returned, and the token needs to be parsed below
        this.loginInOutService
          .loginIn(userToken)
          .then(() => {
            this.router.navigateByUrl('default/dashboard/analysis');
          })
          .finally(() => {
            this.spinService.setCurrentGlobalSpinStore(false);
            // this.notification.blank(
            //   'Kind tips',
            //   `Under the "System Management" menu, a real example of adding, deleting, modifying and checking is done. The data is reset every 10 minutes, so you can operate with confidence.
            //     <br>
            //     I build the server at my own expense every year. If this project is useful to you, please give me a free github star for encouragement. Thank you very much!
            //     Source address: <a href="https://github.com/huajian123/ng-ant-admin">here</a>
            // `,
            //   {
            //     nzDuration: 0
            //   }
            // );
          });
      });
  }




  ngOnInit(): void {}

}
