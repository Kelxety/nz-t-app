/*Configure permission code*/
export const ActionCode = {
  /*Tab operation opens details*/
  TabsDetail: 'default:feat:tabs:example-detail',
  /*Inquiry form Open to view*/
  SearchTableDetail: 'default:page-demo:search-table:example-detail',

  /*System Management*/
  AccountAdd: 'default:system:account:add', // Account management added
  AccountEdit: 'default:system:account:edit', // Account management edit
  AccountDel: 'default:system:account:del', // Account management delete

  /*角色管理*/
  RoleManagerAdd: 'default:system:role-manager:add', // 角色管理新增
  RoleManagerEdit: 'default:system:role-manager:edit', // 角色管理编辑
  RoleManagerDel: 'default:system:role-manager:del', // 角色管理删除
  RoleManagerSetRole: 'default:system:role-manager:set-role', // 角色管理设置角色

  /*菜单管理*/
  MenuAdd: 'default:system:menu:add', // 菜单新增
  MenuEdit: 'default:system:menu:edit', // 菜单编辑
  MenuDel: 'default:system:menu:del', // 菜单删除
  MenuAddLowLevel: 'default:system:menu:addlowlevel', // 菜单添加下级

  /*部门管理*/
  DeptAdd: 'default:system:dept:add', // 部门管理新增
  DeptEdit: 'default:system:dept:edit', // 部门管理编辑
  DeptDel: 'default:system:dept:del', // 部门管理删除
  DeptAddLowLevel: 'default:system:dept:addlowlevel' // 部门管理添加下级
};
