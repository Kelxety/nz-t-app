import { NgIf, NgClass, NgStyle, AsyncPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { ChatComponent } from '@shared/components/chat/chat.component';
import { TopProgressBarComponent } from '@shared/components/top-progress-bar/top-progress-bar.component';
import { SplitNavStoreService } from '@store/common-store/split-nav-store.service';
import { SettingInterface, ThemeService } from '@store/common-store/theme.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { SettingDrawerComponent } from '../setting-drawer/setting-drawer.component';

@Component({
  selector: 'app-def-layout-content',
  templateUrl: './def-layout-content.component.html',
  styleUrls: ['./def-layout-content.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TopProgressBarComponent, NzLayoutModule, NgIf, NgClass, NzNoAnimationModule, NgStyle, SettingDrawerComponent, ChatComponent, NzMenuModule, NzButtonModule, NzIconModule, AsyncPipe]
})
export class DefLayoutContentComponent implements OnInit {
  showChats = true;
  isNightTheme$ = this.themesService.getIsNightTheme();
  themesOptions$ = this.themesService.getThemesMode();
  isMixiMode = false;
  themesOptions: SettingInterface = {
    theme: 'dark',
    color: '',
    mode: 'side',
    splitNav: false,
    isShowTab: true,
    fixedTab: false,
    colorWeak: false,
    greyTheme: false,
    fixedHead: false,
    fixedLeftNav: false,
    hasTopArea: true,
    hasFooterArea: true,
    hasNavArea: true,
    hasNavHeadArea: true
  };
  isFixedLeftNav = false;
  isOverMode$: Observable<boolean> = this.themesService.getIsOverMode();
  isCollapsed$: Observable<boolean> = this.themesService.getIsCollapsed();
  // 混合模式下，判断顶部菜单是否有子菜单，如果没有子菜单，要隐藏左侧菜单
  mixiModeLeftNav = this.splitNavStoreService.getSplitLeftNavArrayStore();
  contentMarginTop = '48px';
  destroyRef = inject(DestroyRef);
  constructor(private themesService: ThemeService, private splitNavStoreService: SplitNavStoreService) {}

  changeCollapsed(isCollapsed: boolean): void {
    this.themesService.setIsCollapsed(isCollapsed);
  }

  getThemeOptions(): void {
    this.themesOptions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.themesOptions = res;
      this.isMixiMode = res.mode === 'mixi';
      this.isFixedLeftNav = this.themesOptions.fixedLeftNav;

      if (this.themesOptions.fixedHead && !this.isMixiMode && this.themesOptions.hasTopArea) {
        this.contentMarginTop = this.themesOptions.isShowTab ? (this.themesOptions.fixedTab ? '96px' : '48px') : '48px';
      } else {
        this.contentMarginTop = this.themesOptions.isShowTab ? (this.themesOptions.fixedTab ? '48px' : '0px') : '0px';
      }
    });
  }

  ngOnInit(): void {
    this.getThemeOptions();
  }
}
