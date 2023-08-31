import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { Subject, takeUntil } from 'rxjs';
import { SharedModule } from '../../../../shared';
import { TmsAccountModalComponent } from '../../../../shared/feature/tms-account-modal/tms-account-modal.component';
import { ItemCatergoryServices } from '../../Services/item-category/item-category.service';
interface TreeNode {
  name: string;
  key: string;
  parentId?: string | null;
  children?: TreeNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  key: string;
  level: number;
}
@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SharedModule]
})
export class ItemCategoryComponent {

  private ngUnsubscribe = new Subject();

  database: TreeNode[] = [];
  isLoading: boolean = false;

  private transformer = (node: TreeNode, level: number): FlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.key === node.key
        ? existingNode
        : {
          expandable: !!node.children && node.children.length > 0,
          name: node.name,
          level,
          key: node.key
        };
    flatNode.name = node.name;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  nodes = [
    {
      title: 'parent 1',
      key: '100',
      expanded: true,
      children: [
        {
          title: 'parent 1-0',
          key: '1001',
          expanded: true,
          children: [
            { title: 'leaf', key: '10010', isLeaf: true },
            { title: 'leaf', key: '10011', isLeaf: true },
            { title: 'leaf', key: '10012', isLeaf: true }
          ]
        },
        {
          title: 'parent 1-1',
          key: '1002',
          children: [{ title: 'leaf', key: '10020', isLeaf: true }]
        },
        {
          title: 'parent 1-2',
          key: '1003',
          children: [
            { title: 'leaf', key: '10030', isLeaf: true },
            { title: 'leaf', key: '10031', isLeaf: true }
          ]
        }
      ]
    }
  ];

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
  }

  search: string = '';
  treeData: TreeNode[] = [];
  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();
  selectListSelection = new SelectionModel<FlatNode>(true);

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );
  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private cd: ChangeDetectorRef,
    private itemCatergoryServices: ItemCatergoryServices,
    private nzContextMenuService: NzContextMenuService,
    private msg: NzMessageService,
    private modalService: NzModalService,
  ) {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    let order: any = [{
      sortColumn: 'sortOrder',
      sortDirection: 'asc'
    }];

    this.itemCatergoryServices.list({ order: order, pagination: false }).subscribe({
      next: (res: any) => {
        console.log('list', res);
        const list = res.data

        this.database = [];
        list.map((x: any) => {
          let tempParent: string | null = null;
          if (x.parentId) { tempParent = x.parentId }

          this.database.push({
            name: `${x.catAcro} - ${x.catName}`,
            key: x.id,
            parentId: tempParent
          })
        });

        this.refresh();
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;
  hasNoContent = (_: number, node: FlatNode): boolean => node.name === '';
  trackBy = (_: number, node: FlatNode): string => `${node.key}-${node.name}`;

  refresh() {
    this.treeData = this.treeConstruct(this.database)
    this.dataSource.setData(this.treeData);
    this.treeControl.expandAll();
    this.cd.checkNoChanges();
  }

  treeConstruct(treeData: any) {
    let constructedTree: any = [];
    for (let i of treeData) {
      let treeObj = i;
      let assigned = false;
      this.constructTree(constructedTree, treeObj, assigned)
    }
    return constructedTree;
  }

  constructTree(constructedTree: any, treeObj: any, assigned: any) {
    if (treeObj.parentId == null) {
      treeObj.children = [];
      constructedTree.push(treeObj);
      return true;
    } else if (treeObj.parentId == constructedTree.key) {
      treeObj.children = [];
      constructedTree.children.push(treeObj);
      return true;
    }
    else {
      if (constructedTree.children != undefined) {
        for (let index = 0; index < constructedTree.children.length; index++) {
          let constructedObj = constructedTree.children[index];
          if (assigned == false) {
            assigned = this.constructTree(constructedObj, treeObj, assigned);
          }
        }
      } else {
        for (let index = 0; index < constructedTree.length; index++) {
          let constructedObj = constructedTree[index];
          if (assigned == false) {
            assigned = this.constructTree(constructedObj, treeObj, assigned);
          }
        }
      }
      return false;
    }
  }

  edit(node: TreeNode) {
    this.database.map(x => {
      if (x.key === node.key) {
        x.name = '';
        this.refresh();
        return;
      }
    })
  }

  delete(node: FlatNode): void {
    const id = node.key;
    const load = this.msg.loading('Removing in progress..', { nzDuration: 0 }).messageId;

    this.itemCatergoryServices.delete(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.database = this.database.filter((item: any) => item.key !== id);
          this.refresh();
          this.msg.remove(load);
        },
        error: (err: any) => {
          this.msg.warning(err.message);
          this.msg.remove(load);
        },
        complete: () => {
        }
      });



    const originNode = this.flatNodeMap.get(node);

    const dfsParentNode = (): TreeNode | null => {
      const stack = [...this.treeData];
      while (stack.length > 0) {
        const n = stack.pop()!;
        if (n.children) {
          if (n.children.find(e => e === originNode)) {
            return n;
          }

          for (let i = n.children.length - 1; i >= 0; i--) {
            stack.push(n.children[i]);
          }
        }
      }
      return null;
    };

    const parentNode = dfsParentNode();
    if (parentNode && parentNode.children) {
      parentNode.children = parentNode.children.filter(e => e !== originNode);
    }

    this.dataSource.setData(this.treeData);
  }

  addNewNode(node: FlatNode): void {
    const parentNode = this.flatNodeMap.get(node);

    console.log('FFF', parentNode);
    if (parentNode) {
      parentNode.children = parentNode.children || [];
      parentNode.children.push({
        name: '',
        key: `${parentNode.key}-${parentNode.children.length}`,
        parentId: parentNode.key,
        children: []
      });
      this.dataSource.setData(this.treeData);
      this.treeControl.expand(node);

      this.cd.checkNoChanges();
      console.log('HAS PARENTCODE');
    } else {
      // parentNode.children = [{name: '', key: `${parentNode.key}-0`}];
      // this.dataSource.setData(this.treeData);
      // this.treeControl.expand(node);
      console.log('NO PARENTCODE');
    }
  }

  cancel(): void {
    // this.msg.info('click cancel');
  }

  add(parentNode: TreeNode) {
    this.database.push({
      name: '',
      parentId: parentNode.key,
      key: `${parentNode.key}-${parentNode.children?.length}`
    })
  }

  saveNode(node: FlatNode, value: string, value2: string): void {
    console.log('XXX', node);
    const nestedNode = this.flatNodeMap.get(node);
    if (nestedNode) {
      nestedNode.name = `${value} - ${value2}`;
      this.dataSource.setData(this.treeData);
    }
  }

  filter(f: any) {

  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  selectDropdown(): void {
    // do something
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next({});
    this.ngUnsubscribe.complete();
  }

  onCreate() {
    const dialogRef = this.modalService.create({
      nzTitle: `Add Account of`,
      nzContent: TmsAccountModalComponent,
      nzData: {
        actionType: 'create'
      },
    });
  }

  action(actionType: string, data: FlatNode) {
    const parentNode = this.flatNodeMap.get(data);
    if (actionType === 'create') {
      const dialogRef = this.modalService.create({
        nzTitle: `Add Account of ${data.name}`,
        nzContent: TmsAccountModalComponent,
        nzData: {
          actionType: 'create',
          parent: data.key
        },
      });

      dialogRef.componentInstance?.statusData.subscribe(
        ($e: any) => {
          this.database.push({
            name: `${$e.data.accountCode} - ${$e.data.accountTitle}`,
            parentId: $e.data.parentId,
            key: $e.data.id
          })
          this.dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);
          // this.refresh();
          this.cd.detectChanges();
          this.refresh();
        },
      );

    } else if (actionType === 'edit') {
      console.log('data.key', data.key);
      const temp: string = data.key;
      const dialogRef = this.modalService.create({
        nzTitle: `Edit Account of ${data.name}`,
        nzContent: TmsAccountModalComponent,
        nzData: {
          actionType: 'edit',
          id: temp,
          parent: data.key
        },
      });

      dialogRef.componentInstance?.statusData.subscribe(
        ($e: any) => {
          const result: any = $e;
          if (result.status === 200) {

            this.cd.detectChanges();
          } else {
            console.log('EEEEEEEEEEEEEEEEEEe');
          }

          this.cd.detectChanges();
        }
      );

    } else if (actionType === 'view') {
      const dialogRef = this.modalService.create({
        nzTitle: 'Region',
        nzContent: TmsAccountModalComponent,
        nzData: {
          actionType: 'view'
        },
      });

    } else if (actionType === 'delete') {
      const dialogRef = this.modalService.create({
        nzTitle: 'Region',
        nzContent: TmsAccountModalComponent,
        nzData: {
          actionType: 'view'
        },
      });
      dialogRef.componentInstance?.statusData.subscribe(
        ($e: any) => {

        },
      );
    }

  }
}
