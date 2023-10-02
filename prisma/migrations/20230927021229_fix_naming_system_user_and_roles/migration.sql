/*
  Warnings:

  - You are about to drop the `_system_user_role` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[role_name]` on the table `system_role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_system_user_role` DROP FOREIGN KEY `_system_user_role_A_fkey`;

-- DropForeignKey
ALTER TABLE `_system_user_role` DROP FOREIGN KEY `_system_user_role_B_fkey`;

-- DropTable
DROP TABLE `_system_user_role`;

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

-- CreateIndex
CREATE UNIQUE INDEX `system_role_role_name_key` ON `system_role`(`role_name`);

-- AddForeignKey
ALTER TABLE `system_permission_role` ADD CONSTRAINT `system_permission_role_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `system_role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_permission_role` ADD CONSTRAINT `system_permission_role_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `system_permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_user_role` ADD CONSTRAINT `system_user_role_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `system_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_user_role` ADD CONSTRAINT `system_user_role_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `system_role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
