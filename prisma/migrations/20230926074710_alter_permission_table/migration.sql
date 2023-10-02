/*
  Warnings:

  - You are about to drop the column `roleId` on the `system_permission` table. All the data in the column will be lost.
  - You are about to alter the column `department_id` on the `system_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `system_permission` DROP FOREIGN KEY `system_permission_roleId_fkey`;

-- AlterTable
ALTER TABLE `_system_user_role` MODIFY `A` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `system_permission` DROP COLUMN `roleId`;

-- AlterTable
ALTER TABLE `system_user` MODIFY `department_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `_system_user_role` ADD CONSTRAINT `_system_user_role_A_fkey` FOREIGN KEY (`A`) REFERENCES `system_role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
