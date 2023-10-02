import { TreeNodeInterface } from '@shared/components/tree-table/tree-table.component';

function convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
  const stack: TreeNodeInterface[] = [];
  const array: TreeNodeInterface[] = [];
  const hashMap = {};
  stack.push({ ...root, level: 0, expand: false, _checked: false });

  while (stack.length !== 0) {
    const node = stack.pop()!;
    visitNode(node, hashMap, array);
    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push({ ...node.children[i], level: node.level! + 1, _checked: false, expand: false, parent: node });
      }
    }
  }

  return array;
}

function visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
  if (!hashMap[node.id]) {
    hashMap[node.id] = true;
    array.push(node);
  }
}

// 获取map形式的treeData,入参为dataList
const fnTreeDataToMap = function tableToTreeData(dataList: any[]): { [key: string]: TreeNodeInterface[] } {
  const mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  dataList.forEach(item => {
    mapOfExpandedData[item.id] = convertTreeToList(item);
  });
  return mapOfExpandedData;
};

/**
 * 该方法用于将有父子关系的数组转换成树形结构的数组
 * 接收一个具有父子关系的数组作为参数
 * 返回一个树形结构的数组
 */
const fnFlatDataHasParentToTree = function translateDataToTree(data: any[], fatherId = 'fatherId'): any {
  // 我们认为，fatherId=0的数据，为一级数据
  //没有父节点的数据
  let parents = data.filter(value => value[fatherId] === 0);

  //有父节点的数据
  let children = data.filter(value => value[fatherId] !== 0);

  //定义转换方法的具体实现
  let translator = (parents: any[], children: any[]): any => {
    //遍历父节点数据
    parents.forEach(parent => {
      //遍历子节点数据
      children.forEach((current, index) => {
        //此时找到父节点对应的一个子节点
        if (current[fatherId] === parent.id) {
          //对子节点数据进行深复制，这里只支持部分类型的数据深复制，对深复制不了解的童靴可以先去了解下深复制
          let temp = JSON.parse(JSON.stringify(children));
          //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
          temp.splice(index, 1);
          //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
          translator([current], temp);
          //把找到子节点放入父节点的children属性中
          typeof parent.children !== 'undefined' ? parent.children.push(current) : (parent.children = [current]);
        }
      });
    });
  };
  //调用转换方法
  translator(parents, children);
  return parents;
};

const fnStringFlatDataHasParentToTree = function translateDataToTree(data: any[], fatherId = 'fatherId'): any {
  // We believe that the data with fatherId=0 is first-level data.
  // No data for parent node
  let parents = data.filter(value => value[fatherId] === null);

  // There is data from the parent node
  let children = data.filter(value => value[fatherId] !== null);

  // Define the concrete implementation of the conversion method
  let translator = (parents: any[], children: any[]): any => {
    // Traverse parent node data
    parents.forEach(parent => {
      // Traverse child node data
      children.forEach((current, index) => {
        // At this time, a child node corresponding to the parent node is found.
        if (current[fatherId] === parent.id) {
          // Perform deep copy of child node data. Only some types of data deep copy are supported here. Children's boots who are not familiar with deep copy can learn about deep copy first.
          let temp = JSON.parse(JSON.stringify(children));
          // Let the current child node be removed from temp, and temp be used as the new child node data. This is to reduce the number of child node traversals during recursion. The more levels of the parent-child relationship, the more advantageous it will be.
          temp.splice(index, 1);
          // Let the current child node be the only parent node and recursively search for its corresponding child node.
          translator([current], temp);
          // Put the found child node into the children attribute of the parent node
          typeof parent.children !== 'undefined' ? parent.children.push(current) : (parent.children = [current]);
        }
      });
    });
  };
  // Call conversion method
  translator(parents, children);
  return parents;
};

// 将树状结构数据添加层级以及是否是根节点的标记，根节点isLeaf为true，层级由level表示
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fnAddTreeDataGradeAndLeaf = function AddTreeDataGradeAndLeaf(array: any[], levelName = 'level', childrenName = 'children') {
  const recursive = (array: any[], level = 0): any => {
    level++;
    return array.map((v: any) => {
      v[levelName] = level;
      const child = v[childrenName];
      if (child && child.length > 0) {
        v.isLeaf = false;
        recursive(child, level);
      } else {
        v.isLeaf = true;
      }
      return v;
    });
  };
  return recursive(array);
};

// 摊平的tree数据
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fnFlattenTreeDataByDataList = function flattenTreeData(dataList: any[]) {
  const mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = fnTreeDataToMap(dataList);
  return fnGetFlattenTreeDataByMap(mapOfExpandedData);
};

// 获取摊平的tree数据,入参为map形式的treeData
const fnGetFlattenTreeDataByMap = function getFlattenTreeData(mapOfExpandedData: { [key: string]: TreeNodeInterface[] }): TreeNodeInterface[] {
  const targetArray: TreeNodeInterface[] = [];
  Object.values(mapOfExpandedData).forEach(item => {
    item.forEach(item_1 => {
      targetArray.push(item_1);
    });
  });
  return targetArray;
};

export { fnTreeDataToMap, fnAddTreeDataGradeAndLeaf, fnStringFlatDataHasParentToTree, fnFlatDataHasParentToTree, fnFlattenTreeDataByDataList, fnGetFlattenTreeDataByMap };
