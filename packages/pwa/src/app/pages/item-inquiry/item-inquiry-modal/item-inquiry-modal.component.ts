import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Injector, Renderer2, RendererFactory2, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { Observable, of } from 'rxjs';
import { SharedModule } from '../../../shared';
import { StockLegderServices } from '../../configuration/Services/Stock-legder/stock-ledger.service';
@Component({
  selector: 'app-item-inquiry-modal',
  templateUrl: './item-inquiry-modal.component.html',
  standalone: true,
  imports: [SharedModule, FormsModule, NzFormModule, ReactiveFormsModule, NzGridModule, NzInputModule, NgIf, NzRadioModule, NzSwitchModule, NzTreeSelectModule, NzSelectModule, NgFor,]
})
export class ItemInquiryModalComponent {
  protected bsModalService: NzModalService;
  readonly nzModalData: any = inject(NZ_MODAL_DATA);
  stockLegderServices = inject(StockLegderServices)
  // readonly nzModalRef: any = inject(NzModalRef)
  model: any = {
    list: [],
    filteredList: [],
    isSubmitting: false,
    loading: false
  };

  private renderer: Renderer2;
  isLoading = false;

  itemDataList = signal<any>([])
  listOfCurrentPageData: any = [];
  totalCost = signal<number>(0)
  totalCostAmount = signal<number>(0)
  refNo = signal<any>('')

  constructor(
    private baseInjector: Injector,
    private modalRef: NzModalRef,
    rendererFactory: RendererFactory2,
    private cd: ChangeDetectorRef) {
    this.bsModalService = this.baseInjector.get(NzModalService);
  }

  async ngOnInit(): Promise<void> {
    console.log(this.nzModalData)
    this.loadLedger()

  }

  loadLedger() {
    this.stockLegderServices.list({ filteredObject: JSON.stringify({ itemdtlId: this.nzModalData?.id }) }).subscribe(({
      next: (value) => {
        console.log(value)
        this.itemDataList.set(value.data)
      }, error: (err) => {

      },
      complete: () => {

      },
    }))
  }

  protected getAsyncFnData(modalValue: NzSafeAny): Observable<NzSafeAny> {
    return of(modalValue);
  }

  protected getCurrentValue(): Observable<NzSafeAny> {
    return of(this.itemDataList());
  }

  onCurrentPageDataChange($event: readonly any[]): void {
    this.listOfCurrentPageData = $event;
    this.cd.detectChanges
  }

  removeFromHeaderList(data: any) {
    if (data.itemData === null) {
      this.itemDataList.update(list => {
        return list.filter(item => item.itemData !== null);
      });
    } else {
      this.itemDataList.update(list => {
        return list.filter(item => item.itemData.id !== data.itemData.id);
      });
    }
    this.footerTotalCost()

  }
  footerTotalCost() {
    let totalCost = 0
    this.itemDataList.mutate(data => {

      totalCost = data.reduce((accumulator, item) => {
        for (const itemDetail of item.itemDetails) {
          accumulator += itemDetail.costAmount || 0;
        }
        return accumulator;
      }, 0);
      console.log(totalCost)
      this.totalCostAmount.set(totalCost)
    })

  }

  removeFromDetailList(data: any, detailData: any) {
    console.log(data)
    this.itemDataList.update(list => {
      // Find the index of the itemData to modify
      const existingGroupIndex = list.findIndex(
        item => item.itemData.id === data.itemData.id
      );

      // If the itemData exists and the index is valid
      if (existingGroupIndex !== -1) {

        const itemDetails = list[existingGroupIndex].itemDetails;

        // Find the index of the itemDetail to remove based on the condition
        const itemDetailIndexToRemove = itemDetails.findIndex(itemDetail =>

          itemDetail.expirationDate === detailData.expirationDate &&
          itemDetail.lotNo === detailData.lotNo
        );

        // If the itemDetail index to remove is valid, remove it from itemDetails
        if (itemDetailIndexToRemove !== -1) {
          itemDetails.splice(itemDetailIndexToRemove, 1);
        }
      }

      return list;
    });
    this.footerTotalCost()
  }

}
