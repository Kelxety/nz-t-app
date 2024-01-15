-- CreateTable
CREATE TABLE `scm_item` (
    `id` VARCHAR(191) NOT NULL,
    `item_code` VARCHAR(36) NULL,
    `barcode` VARCHAR(50) NULL,
    `item_name` VARCHAR(255) NULL,
    `item_description` VARCHAR(50) NULL,
    `itemcategory_id` VARCHAR(36) NULL,
    `unit_id` VARCHAR(36) NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `itemImage` VARCHAR(120) NULL,

    UNIQUE INDEX `scm_item_item_code_key`(`item_code`),
    UNIQUE INDEX `scm_item_item_name_key`(`item_name`),
    INDEX `itemcategory_id`(`itemcategory_id`),
    INDEX `unit_id`(`unit_id`),
    FULLTEXT INDEX `scm_item_item_code_barcode_item_name_idx`(`item_code`, `barcode`, `item_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_user` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NULL,
    `account_name` VARCHAR(50) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `middle_name` VARCHAR(50) NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NULL,
    `status` ENUM('Active', 'Inactive', 'Banned') NOT NULL DEFAULT 'Active',
    `description` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `department_id` VARCHAR(191) NULL,
    `warehouse_id` VARCHAR(191) NULL,
    `office_id` VARCHAR(191) NULL,

    UNIQUE INDEX `system_user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hospital_office` (
    `id` VARCHAR(191) NOT NULL,
    `office_name` VARCHAR(255) NULL,
    `office_acro` VARCHAR(50) NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_warehouse` (
    `id` VARCHAR(191) NOT NULL,
    `wh_name` VARCHAR(150) NOT NULL,
    `wh_acro` VARCHAR(50) NOT NULL,
    `state` VARCHAR(20) NULL DEFAULT 'active',
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `scm_warehouse_wh_acro_key`(`wh_acro`),
    FULLTEXT INDEX `scm_warehouse_wh_name_wh_acro_idx`(`wh_name`, `wh_acro`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_refresh_token` (
    `id` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(255) NOT NULL,
    `validity` DATETIME(3) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `system_refresh_token_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_role` (
    `id` VARCHAR(191) NOT NULL,
    `role_name` VARCHAR(50) NOT NULL,
    `role_desc` VARCHAR(255) NULL,

    UNIQUE INDEX `system_role_role_name_key`(`role_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_permission` (
    `id` VARCHAR(191) NOT NULL,
    `menu_name` VARCHAR(50) NOT NULL,
    `code` VARCHAR(100) NOT NULL,
    `father_id` VARCHAR(191) NULL,
    `orderNum` INTEGER NOT NULL DEFAULT 0,
    `path` VARCHAR(200) NULL,
    `menu_type` CHAR(1) NULL,
    `visible` CHAR(1) NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `is_new_link` BOOLEAN NULL,
    `al_icon` VARCHAR(100) NULL,
    `icon` VARCHAR(100) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `system_permission_menu_name_key`(`menu_name`),
    UNIQUE INDEX `system_permission_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_permission_role` (
    `roleId` VARCHAR(191) NOT NULL,
    `permissionId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `assignedBy` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`roleId`, `permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_user_role` (
    `userId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_department` (
    `id` VARCHAR(191) NOT NULL,
    `department_name` VARCHAR(255) NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `father_id` INTEGER NOT NULL DEFAULT 0,
    `order_num` INTEGER NOT NULL DEFAULT 0,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `system_user` ADD CONSTRAINT `system_user_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `system_department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_user` ADD CONSTRAINT `system_user_warehouse_id_fkey` FOREIGN KEY (`warehouse_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_user` ADD CONSTRAINT `system_user_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `hospital_office`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_refresh_token` ADD CONSTRAINT `system_refresh_token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `system_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_permission_role` ADD CONSTRAINT `system_permission_role_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `system_role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_permission_role` ADD CONSTRAINT `system_permission_role_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `system_permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_user_role` ADD CONSTRAINT `system_user_role_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `system_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_user_role` ADD CONSTRAINT `system_user_role_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `system_role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
