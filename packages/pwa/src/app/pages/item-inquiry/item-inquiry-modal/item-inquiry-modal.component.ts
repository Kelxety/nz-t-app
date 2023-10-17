import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Injector, RendererFactory2, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScmWarehouse } from '@prisma/client';
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
import { WarehouseServices } from '../../configuration/Services/warehouse/warehouse.service';
interface ledgerData {
  id: string;
  fyCode: number;
  entryDate: Date;
  warehouseId: string;
  itemlocationdtlId: string;
  itemdtlId: string;
  ledgercodeId: string;
  refno: string;
  refdate: Date;
  qty: number;
  cost: number;
  price: number;
  postedBy: string;
  postedAt: Date;

}
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
  warehouseServices = inject(WarehouseServices)
  // readonly nzModalRef: any = inject(NzModalRef)

  model: any = {
    list: [],
    filteredList: [],
    isSubmitting: false,
    loading: false
  };
  ledgerData = signal<any>([])
  summaryData = signal<any>([])
  totalIn = signal<number>(0)
  totalOut = signal<number>(0)
  totalQuantity = signal<number>(0)
  listOfCurrentPageData: readonly ledgerData[] = [];
  listOfData: readonly ledgerData[] = [];

  search: string = '';
  isLoading = false;

  itemDtls: any
  selectedValue: any;
  listOfItem: ScmWarehouse[] = [];

  totalBalanceQty = signal<number>(0)
  refNo = signal<any>('')
  totalBal = signal<number>(0)

  constructor(
    private baseInjector: Injector,
    private modalRef: NzModalRef,
    rendererFactory: RendererFactory2,
    private cd: ChangeDetectorRef) {
    this.bsModalService = this.baseInjector.get(NzModalService);
  }

  async ngOnInit(): Promise<void> {
    console.log(this.nzModalData)
    this.itemDtls = this.nzModalData


    const promise = [Promise.resolve(this.loadWarehouse())]
    Promise.all(promise)
  }

  loadSummary() {
    let qtyHand = this.totalIn() - this.totalOut() || 0
    this.totalBal.set(qtyHand)
    this.summaryData.set([
      // {
      //   summary: 'Beggining Balance',
      //   quantity: this.itemDtls.balanceQty,
      //   cost: (this.itemDtls.cost * this.itemDtls.balanceQty),
      //   price: (this.itemDtls.price * this.itemDtls.balanceQty)
      // },
      {
        summary: 'IN (+)',
        quantity: this.totalIn(),
        cost: this.totalIn() * this.itemDtls.cost || 0,
        price: this.totalIn() * this.itemDtls.price || 0
      },
      {
        summary: 'OUT (-)',
        quantity: this.totalOut(),
        cost: this.totalOut() * this.itemDtls.cost || 0,
        price: this.totalOut() * this.itemDtls.price || 0
      },
      {
        summary: 'Qty. on Hand',
        quantity: qtyHand,
        cost: qtyHand * this.itemDtls.cost || 0,
        price: qtyHand * this.itemDtls.price || 0
      }

    ])
    this.cd.detectChanges()

  }

  legderTotalIn() {
    let quantitiesByLedgerCodeIn = 0;

    this.ledgerData.mutate(data => {
      data.forEach(item => {
        if (item.scmLedgerCode.ledgerFlag === 'IN') {
          quantitiesByLedgerCodeIn += item.qty || 0;
        }
      });
    });

    this.totalIn.set(quantitiesByLedgerCodeIn);
    console.log(this.totalIn())
    this.legderTotalOut()
    this.cd.detectChanges()
  }

  legderTotalOut() {
    let quantitiesByLedgerCodeOut = 0;

    this.ledgerData.mutate(data => {
      data.forEach(item => {
        if (item.scmLedgerCode.ledgerFlag === 'OUT') {
          quantitiesByLedgerCodeOut += item.qty || 0;
        }
      });

    });

    this.totalOut.set(quantitiesByLedgerCodeOut);
    this.loadSummary()
    this.cd.detectChanges()
  }

  loadLedger() {
    let model: any = this.model;
    model.loading = true;
    console.log(this.selectedValue)

    this.stockLegderServices.list({ pagination: false, orderBy: [{ entryDate: 'asc' }], filteredObject: JSON.stringify({ itemdtlId: this.nzModalData?.id, warehouseId: this.selectedValue?.id }) }).subscribe(({
      next: (value) => {
        this.ledgerData.set(value.data)
        const list = value.data

        value.data.forEach((res: any) => {
          if (res?.scmLedgerCode.ledgerFlag === 'IN') {
            this.totalBalanceQty.set(res.scmItemLocationDtl.balanceQty)
          }
        })

        model.list = list;
        model.filteredList = list;
        // this.itemDataList.set(value.data)
      }, error: (err) => {

      },
      complete: () => {
        model.loading = false;
        this.legderTotalIn()
        this.cd.detectChanges();
      },
    }))
  }

  loadWarehouse() {
    this.isLoading = true
    Promise.resolve(this.warehouseServices.list({ pagination: false, state: 'Active' }).subscribe({
      next: (res: any) => {
        const list = res.data;
        this.listOfItem = list;
        this.selectedValue = res.data[0]
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false
        this.cd.detectChanges();
        this.loadLedger()
      }
    }))

  }

  protected getAsyncFnData(modalValue: NzSafeAny): Observable<NzSafeAny> {
    return of(modalValue);
  }

  protected getCurrentValue(): Observable<NzSafeAny> {
    return of();
  }

  onCurrentPageDataChange($event: readonly any[]): void {
    this.listOfCurrentPageData = $event;
    this.cd.detectChanges
  }


}
