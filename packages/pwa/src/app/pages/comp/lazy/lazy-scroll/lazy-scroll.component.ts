import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, AfterViewInit, NgZone, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, take } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { LazyServiceService } from '@app/pages/comp/lazy/lazy-service.service';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AdDirective } from '@shared/directives/ad.directive';

const passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true });

@Component({
  selector: 'app-lazy-scroll',
  templateUrl: './lazy-scroll.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LazyServiceService],
  standalone: true,
  imports: [PageHeaderComponent, AdDirective]
})
export class LazyScrollComponent implements OnInit, AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '滚动懒加载组件示例',
    breadcrumb: ['Front page', '组件', '滚动懒加载'],
    desc: '滚动页面，加载组件'
  };
  @ViewChild(AdDirective, { static: true }) adHost!: AdDirective;
  destroyRef = inject(DestroyRef);
  constructor(private lazyServiceService: LazyServiceService, private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.lazyServiceService.adHost = this.adHost;
    this.zone.runOutsideAngular(() => {
      fromEvent(window, 'scroll', <AddEventListenerOptions>passiveEventListenerOptions)
        .pipe(
          debounceTime(50),
          filter(() => {
            return window.scrollY >= 200;
          }),
          take(1),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          this.lazyServiceService.create().then(() => {
            this.cdr.detectChanges();
          });
        });
    });
  }
}
