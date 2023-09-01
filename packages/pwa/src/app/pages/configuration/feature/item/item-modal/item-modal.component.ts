import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SharedModule } from '../../../../../shared';

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.less'],
  standalone: true,
  imports: [SharedModule]
})
export class ItemModalComponent {
  validateForm!: UntypedFormGroup;
  selectedValue = 'Active';
  listOfOption = [
    { label: 'Active', value: 'Active' },
    { label: 'In Active', value: 'In Active' }
  ];

  treeData: any;

  constructor(private fb: UntypedFormBuilder, private router: Router) {
    this.validateForm = this.fb.group({
      itemCode: [null],
      barcode: [null],
      // checkPassword: [null, [Validators.required, this.confirmationValidator]],
      itemName: [null, [Validators.min(4), Validators.required]],
      itemDescription: [null],
      itemCategory: [null, [Validators.required]],
      state: [null]
      // phoneNumberPrefix: ['+86'],
      // phoneNumber: [null, [Validators.required]],
      // website: [null, [Validators.required]],
      // captcha: [null, [Validators.required]],
      // agree: [false]
    });
  }

  onCancel(): void {
    this.router.navigate(['/default/configuration/item']);
  }

  treeConstruct(treeData: any): Promise<any> {
    let constructedTree: any = [];
    for (let i of treeData) {
      let treeObj = i;
      let assigned = false;
      this.constructTree(constructedTree, treeObj, assigned);
    }
    return constructedTree;
  }

  constructTree(constructedTree: any, treeObj: any, assigned: any): boolean {
    if (treeObj.parentId == null) {
      treeObj.children = [];
      treeObj.expanded = true;
      treeObj.selectable = true;
      treeObj.isLeaf = false;
      constructedTree.push(treeObj);
      return true;
    } else if (treeObj.parentId == constructedTree.key) {
      treeObj.children = [];
      treeObj.expanded = true;
      treeObj.selectable = true;
      treeObj.isLeaf = false;
      constructedTree.children.push(treeObj);
      return true;
    } else {
      treeObj.expanded = false;
      treeObj.selectable = true;
      treeObj.isLeaf = true;
      if (constructedTree.children != undefined) {
        for (let index = 0; index < constructedTree.children.length; index++) {
          let constructedObj = constructedTree.children[index];
          if (assigned == false) {
            assigned = this.constructTree(constructedObj, treeObj, assigned);
          }
        }
      } else {
        constructedTree.selectable = false;
        constructedTree.isLeaf = true;
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
}
