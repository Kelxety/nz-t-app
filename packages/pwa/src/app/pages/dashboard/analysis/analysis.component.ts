import { NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, NgZone, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserInfoService } from '@app/core/services/store/common-store/userInfo.service';

import { NumberLoopPipe } from '@shared/pipes/number-loop.pipe';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { inNextTick } from 'ng-zorro-antd/core/util';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

interface DataItem {
  name: string;
  chinese: number;
  math: number;
  english: number;
}

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzCardModule,
    NzBreadCrumbModule,
    NzGridModule,
    NzIconModule,
    NzButtonModule,
    NzToolTipModule,
    NzDividerModule,
    NzTabsModule,
    NgFor,
    NzBadgeModule,
    NzRadioModule,
    NzDatePickerModule,
    NzTypographyModule,
    NzTableModule,
    NumberLoopPipe
  ]
})
export class AnalysisComponent implements OnInit, AfterViewInit {
  destroyRef = inject(DestroyRef);

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone, public userInfoService: UserInfoService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    inNextTick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.ngZone.runOutsideAngular(() => {

        });
      });
  }
}
