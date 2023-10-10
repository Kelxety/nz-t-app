import { DOCUMENT, NgIf, NgTemplateOutlet, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Inject, inject, DestroyRef, booleanAttribute } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, share, switchMap, tap } from 'rxjs/operators';

import { ThemeMode } from '@app/layout/default/setting-drawer/setting-drawer.component';
import { TabService } from '@core/services/common/tab.service';
import { Menu } from '@core/services/types';
import { AuthDirective } from '@shared/directives/auth.directive';
import { TrackByPropertyDirective } from '@shared/directives/track-by-property.directive';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { SplitNavStoreService } from '@store/common-store/split-nav-store.service';
import { ThemeService } from '@store/common-store/theme.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { fnStopMouseEvent } from '@utils/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NzMenuModule, NzNoAnimationModule, NgTemplateOutlet, NgFor, TrackByPropertyDirective, AuthDirective, NzButtonModule, NzIconModule, RouterLink, AsyncPipe]
})
export class NavBarComponent implements OnInit {
  @Input({ transform: booleanAttribute })
  isMixiHead = false; // 是混合模式顶部导航
  @Input({ transform: booleanAttribute })
  isMixiLeft = false;

  themesOptions$ = this.themesService.getThemesMode();
  isNightTheme$ = this.themesService.getIsNightTheme();
  isCollapsed$ = this.themesService.getIsCollapsed();
  isOverMode$ = this.themesService.getIsOverMode();
  leftMenuArray$ = this.splitNavStoreService.getSplitLeftNavArrayStore();

  routerPath = this.router.url;
  themesMode: ThemeMode['key'] = 'side';
  isOverMode = false;
  isCollapsed = false;
  isMixiMode = false;
  leftMenuArray: Menu[] = [];
  menus: Menu[] = [];
  copyMenus: Menu[] = [];
  authCodeArray: string[] = [];
  subTheme$: Observable<any>;
  destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private userInfoService: UserInfoService,
    private menuServices: MenuStoreService,
    private splitNavStoreService: SplitNavStoreService,
    private activatedRoute: ActivatedRoute,
    private tabService: TabService,
    private cdr: ChangeDetectorRef,
    private themesService: ThemeService,
    private titleServe: Title,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.initMenus();

    this.subTheme$ = this.isOverMode$.pipe(
      switchMap(res => {
        this.isOverMode = res;
        return this.themesOptions$;
      }),
      tap(options => {
        this.themesMode = options.mode;
        this.isMixiMode = this.themesMode === 'mixi';
      }),
      share(),
      takeUntilDestroyed(this.destroyRef)
    );

    // 监听混合模式下左侧菜单数据源
    this.subMixiModeSideMenu();
    // 监听折叠菜单事件
    this.subIsCollapsed();
    this.subAuth();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          this.subTheme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            // 主题切换为混合模式下，设置左侧菜单数据源
            // 如果放在ngInit监听里面，会在混合模式下，刷新完页面切换路由，runOutSideAngular
            if (this.isMixiMode) {
              this.setMixModeLeftMenu();
            }
          });
          // @ts-ignore
          this.routerPath = this.activatedRoute.snapshot['_routerState'].url;
          // 做一个copyMenus来记录当前menu状态，因为顶部模式时是不展示子menu的，然而主题由顶部模式切换成侧边栏模式，要把当前顶部模式中菜单的状态体现于侧边栏模式的菜单中
          this.clickMenuItem(this.menus);
          this.clickMenuItem(this.copyMenus);
          // 是折叠的菜单并且不是over菜单,解决折叠左侧菜单时，切换tab会有悬浮框菜单的bug
          if (this.isCollapsed && !this.isOverMode) {
            this.closeMenuOpen(this.menus);
          }

          // 顶部菜单模式，并且不是over模式，解决顶部模式时，切换tab会有悬浮框菜单的bug
          if (this.themesMode === 'top' && !this.isOverMode) {
            this.closeMenu();
          }
        }),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => {
          return route.outlet === 'primary';
        }),
        mergeMap(route => {
          return route.data;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(routeData => {
        // 详情页是否是打开新tab页签形式
        let isNewTabDetailPage = routeData['newTab'] === 'true';

        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }

        this.tabService.addTab(
          {
            snapshotArray: [route.snapshot],
            title: routeData['title'],
            path: this.routerPath
          },
          isNewTabDetailPage
        );
        this.tabService.findIndex(this.routerPath);
        // angular16以后可以在路由中直接设置title了
        this.titleServe.setTitle(`${routeData['title']} - HMIS v2`);
        // 混合模式时，切换tab，让左侧菜单也相应变化
        this.setMixModeLeftMenu();
      });
  }

  initMenus(): void {
    this.menuServices
      .getMenuArrayStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(menusArray => {
        this.menus = menusArray;
        this.copyMenus = this.cloneMenuArray(this.menus);
        this.clickMenuItem(this.menus);
        this.clickMenuItem(this.copyMenus);
        this.cdr.markForCheck();
      });
  }

  // 设置混合模式时，左侧菜单"自动分割菜单"模式的数据源
  setMixModeLeftMenu(): void {
    this.menus.forEach(item => {
      if (item.selected) {
        this.splitNavStoreService.setSplitLeftNavArrayStore(item.children || []);
      }
    });
  }

  // 深拷贝克隆菜单数组
  cloneMenuArray(sourceMenuArray: Menu[], target: Menu[] = []): Menu[] {
    sourceMenuArray.forEach(item => {
      const obj: Menu = { menuName: '', menuType: 'C', path: '', id: -1, fatherId: -1 };
      for (let i in item) {
        if (item.hasOwnProperty(i)) {
          // @ts-ignore
          if (Array.isArray(item[i])) {
            // @ts-ignore
            obj[i] = this.cloneMenuArray(item[i]);
          } else {
            // @ts-ignore
            obj[i] = item[i];
          }
        }
      }
      target.push({ ...obj });
    });
    return target;
  }

  // 混合模式点击一级菜单，要让一级菜单下的第一个子菜单被选中
  changTopNav(index: number): void {
    // 当前选中的第一级菜单对象
    const currentTopNav = this.menus[index];
    let currentLeftNavArray = currentTopNav.children || [];
    // 如果一级菜单下有二级菜单
    if (currentLeftNavArray.length > 0) {
      // 当前左侧导航数组
      /*添加了权限版*/
      // 获取有权限的二级菜单集合（在左侧展示的）
      currentLeftNavArray = currentLeftNavArray.filter(item => {
        return this.authCodeArray.includes(item.code!);
      });
      // 如果第一个二级菜单，没有三级菜单
      if (currentLeftNavArray.length > 0 && !currentLeftNavArray[0].children) {
        this.router.navigateByUrl(currentLeftNavArray[0].path!);
      } else if (currentLeftNavArray.length > 0 && currentLeftNavArray[0].children) {
        // 如果有三级菜单，则跳转到第一个三级菜单
        this.router.navigateByUrl(currentLeftNavArray[0].children[0].path!);
      }
      /*添加了权限版结束*/
      /*注释的是没有权限版*/
      // const currentLeftNavArray = currentTopNav.children;
      // if (!currentLeftNavArray[0].children) {
      //   this.router.navigateByUrl(currentLeftNavArray[0].path!);
      //   this.splitNavStoreService.setSplitLeftNavArrayStore(currentLeftNavArray);
      // } else {
      //   this.router.navigateByUrl(currentLeftNavArray[0].children[0].path!);
      //   this.splitNavStoreService.setSplitLeftNavArrayStore(currentLeftNavArray);
      // }
    }
    this.splitNavStoreService.setSplitLeftNavArrayStore(currentLeftNavArray);
  }

  flatMenu(menus: Menu[], routePath: string): void {
    menus.forEach(item => {
      item.selected = false;
      item.open = false;
      if (routePath.includes(item.path) && !item.isNewLink) {
        item.selected = true;
        item.open = true;
      }
      if (!!item.children && item.children.length > 0) {
        this.flatMenu(item.children, routePath);
      }
    });
  }

  clickMenuItem(menus: Menu[]): void {
    if (!menus) {
      return;
    }
    const index = this.routerPath.indexOf('?') === -1 ? this.routerPath.length : this.routerPath.indexOf('?');
    const routePath = this.routerPath.substring(0, index);
    this.flatMenu(menus, routePath);
    this.cdr.markForCheck();
  }

  // 改变当前菜单展示状态
  changeOpen(currentMenu: Menu, allMenu: Menu[]): void {
    allMenu.forEach(item => {
      item.open = false;
    });
    currentMenu.open = true;
  }

  closeMenuOpen(menus: Menu[]): void {
    menus.forEach(menu => {
      menu.open = false;
      if (menu.children && menu.children.length > 0) {
        this.closeMenuOpen(menu.children);
      } else {
        return;
      }
    });
  }

  changeRoute(e: MouseEvent, menu: Menu): void {
    if (menu.isNewLink) {
      fnStopMouseEvent(e);
      window.open(menu.path, '_blank');
      return;
    }
    this.router.navigate([menu.path]);
  }

  // 监听折叠菜单事件
  subIsCollapsed(): void {
    this.isCollapsed$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(isCollapsed => {
      this.isCollapsed = isCollapsed;
      // 菜单展开
      if (!this.isCollapsed) {
        this.menus = this.cloneMenuArray(this.copyMenus);
        this.clickMenuItem(this.menus);
        // 混合模式下要在点击一下左侧菜单数据源,不然有二级菜单的菜单在折叠状态变为展开时，不open
        if (this.themesMode === 'mixi') {
          this.clickMenuItem(this.leftMenuArray);
        }
      } else {
        // 菜单收起
        this.copyMenus = this.cloneMenuArray(this.menus);
        this.closeMenuOpen(this.menus);
      }
      this.cdr.markForCheck();
    });
  }

  closeMenu(): void {
    this.clickMenuItem(this.menus);
    this.clickMenuItem(this.copyMenus);
    this.closeMenuOpen(this.menus);
  }

  subAuth(): void {
    this.userInfoService
      .getUserInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => (this.authCodeArray = res.authCode));
  }

  // 监听混合模式下左侧菜单数据源
  private subMixiModeSideMenu(): void {
    this.leftMenuArray$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.leftMenuArray = res;
    });
  }

  ngOnInit(): void {
    // 顶部模式时要关闭menu的open状态
    this.subTheme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(options => {
      if (options.mode === 'top' && !this.isOverMode) {
        this.closeMenu();
      }
    });
  }
}
