import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  const superadmin = await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      password: hashedPassword,
      name: 'superadmin',
      accountName: 'superadmin',
      firstName: 'super',
      middleName: 'a',
      lastName: 'dmin',
      role: {
        create: {
          role: {
            create: {
              roleName: 'SUPERADMIN',
              roleDesc: 'ACCESS TO ALL',
            },
          },
        },
      },
    },
  });
  console.log(superadmin);

  const dashboard = await prisma.permission.create({
    data: {
      menuName: 'Dashboard',
      code: 'default:dashboard',
      fatherId: null,
      orderNum: 1,
      path: '/default/dashboard',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'dashboard',
    },
  });
  console.log(dashboard);

  const analysis = await prisma.permission.create({
    data: {
      menuName: 'Analysis',
      code: 'default:dashboard:analysis',
      fatherId: dashboard.id,
      orderNum: 1,
      path: '/default/dashboard/analysis',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'fund',
    },
  });
  console.log(analysis);

  const receiving = await prisma.permission.create({
    data: {
      menuName: 'Stock Receiving',
      code: 'default:receiving',
      fatherId: null,
      orderNum: 2,
      path: '/default/receiving',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'arrows-alt',
    },
  });
  console.log(receiving);

  const priceUpdate = await prisma.permission.create({
    data: {
      menuName: 'Price Update',
      code: 'default:price-update',
      fatherId: null,
      orderNum: 3,
      path: '/default/price-update',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'arrows-alt',
    },
  });
  console.log(priceUpdate);

  const configurationFather = await prisma.permission.create({
    data: {
      menuName: 'Configuration',
      code: 'default:configuration',
      fatherId: null,
      orderNum: 4,
      path: '/default/configuration',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'setting',
    },
  });
  console.log(configurationFather);

  const configurationItem = await prisma.permission.create({
    data: {
      menuName: 'Item',
      code: 'default:configuration:item',
      fatherId: configurationFather.id,
      orderNum: 1,
      path: '/default/configuration/item',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'setting',
    },
  });
  console.log(configurationItem);

  const configurationItemCategory = await prisma.permission.create({
    data: {
      menuName: 'Item Category',
      code: 'default:configuration:item-category',
      fatherId: configurationFather.id,
      orderNum: 2,
      path: '/default/configuration/item-category',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'setting',
    },
  });
  console.log(configurationItemCategory);

  const configurationUnit = await prisma.permission.create({
    data: {
      menuName: 'Unit',
      code: 'default:configuration:unit',
      fatherId: configurationFather.id,
      orderNum: 3,
      path: '/default/configuration/unit',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'setting',
    },
  });
  console.log(configurationUnit);

  const configurationWarehouse = await prisma.permission.create({
    data: {
      menuName: 'Warehouse',
      code: 'default:configuration:warehouse',
      fatherId: configurationFather.id,
      orderNum: 4,
      path: '/default/configuration/warehouse',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'setting',
    },
  });
  console.log(configurationWarehouse);

  const configurationSupplier = await prisma.permission.create({
    data: {
      menuName: 'Supplier',
      code: 'default:configuration:supplier',
      fatherId: configurationFather.id,
      orderNum: 5,
      path: '/default/configuration/supplier',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'setting',
    },
  });
  console.log(configurationSupplier);

  const configurationRRMode = await prisma.permission.create({
    data: {
      menuName: 'Receive mode',
      code: 'default:configuration:receive-mode',
      fatherId: configurationFather.id,
      orderNum: 6,
      path: '/default/configuration/receive-mode',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'setting',
    },
  });
  console.log(configurationRRMode);

  const system = await prisma.permission.create({
    data: {
      menuName: 'System Management',
      code: 'default:system',
      fatherId: null,
      orderNum: 100,
      path: '/default/system',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'menu',
    },
  });
  console.log(system);

  const accountManagement = await prisma.permission.create({
    data: {
      menuName: 'Account Management',
      code: 'default:system:account',
      fatherId: system.id,
      orderNum: 1,
      path: '/default/system/account',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'menu',
    },
  });
  console.log(accountManagement);

  const roleManagement = await prisma.permission.create({
    data: {
      menuName: 'Role Management',
      code: 'default:system:role-manager',
      fatherId: system.id,
      orderNum: 2,
      path: '/default/system/role-manager',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'menu',
    },
  });
  console.log(roleManagement);

  const menuManagement = await prisma.permission.create({
    data: {
      menuName: 'Menu Management',
      code: 'default:system:menu',
      fatherId: system.id,
      orderNum: 3,
      path: '/default/system/menu',
      menuType: 'C',
      visible: '1',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'menu',
    },
  });
  console.log(menuManagement);

  const setRole = await prisma.permission.create({
    data: {
      menuName: 'Set Role',
      code: 'default:system:role-manager:set-role',
      fatherId: roleManagement.id,
      orderNum: 4,
      path: '',
      menuType: 'F',
      visible: '0',
      isNewLink: false,
      status: 'ACTIVE',
      alIcon: '',
      icon: 'radius-setting',
    },
  });
  console.log(setRole);

  const getRoleSuperadmin = await prisma.role.findUnique({
    where: {
      roleName: 'SUPERADMIN',
    },
  });
  console.log(getRoleSuperadmin);

  const permissionToRoleAnalysis = await prisma.permissionOnRoles.create({
    data: {
      permissionId: analysis.id,
      roleId: getRoleSuperadmin.id,
      assignedBy: superadmin.name,
    },
  });
  console.log(permissionToRoleAnalysis);

  const permissionToRoleSystem = await prisma.permissionOnRoles.create({
    data: {
      permissionId: system.id,
      roleId: getRoleSuperadmin.id,
      assignedBy: superadmin.name,
    },
  });
  console.log(permissionToRoleSystem);

  const permissionToRoleDashboard = await prisma.permissionOnRoles.create({
    data: {
      permissionId: dashboard.id,
      roleId: getRoleSuperadmin.id,
      assignedBy: superadmin.name,
    },
  });
  console.log(permissionToRoleDashboard);

  const permissionToRoleSetManagement = await prisma.permissionOnRoles.create({
    data: {
      permissionId: roleManagement.id,
      roleId: getRoleSuperadmin.id,
      assignedBy: superadmin.name,
    },
  });
  console.log(permissionToRoleSetManagement);

  const permissionToRoleSetAccount = await prisma.permissionOnRoles.create({
    data: {
      permissionId: accountManagement.id,
      roleId: getRoleSuperadmin.id,
      assignedBy: superadmin.name,
    },
  });
  console.log(permissionToRoleSetAccount);

  const permissionToRoleSetMenu = await prisma.permissionOnRoles.create({
    data: {
      permissionId: menuManagement.id,
      roleId: getRoleSuperadmin.id,
      assignedBy: superadmin.name,
    },
  });
  console.log(permissionToRoleSetMenu);

  const permissionToRoleSetRoleManagement =
    await prisma.permissionOnRoles.create({
      data: {
        permissionId: setRole.id,
        roleId: getRoleSuperadmin.id,
        assignedBy: superadmin.name,
      },
    });
  console.log(permissionToRoleSetRoleManagement);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
