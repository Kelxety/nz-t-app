/*
  Warnings:

  - You are about to alter the column `A` on the `_system_user_role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `system_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `menuType` on the `system_permission` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `system_permission` table. All the data in the column will be lost.
  - You are about to drop the column `sort` on the `system_permission` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `system_permission` table. All the data in the column will be lost.
  - You are about to drop the column `urlCode` on the `system_permission` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `system_permission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `system_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `system_role` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `system_role` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `system_role` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `system_role` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `system_role` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `system_role` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `system_role` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `system_role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[menu_name]` on the table `system_permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `system_permission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `system_permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menu_name` to the `system_permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visible` to the `system_permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_name` to the `system_role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_system_user_role` DROP FOREIGN KEY `_system_user_role_A_fkey`;

-- -- DropForeignKey
-- ALTER TABLE `system_permission` DROP FOREIGN KEY `system_permission_roleId_fkey`;

-- AlterTable
ALTER TABLE `_system_user_role` MODIFY `A` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `system_permission`
    DROP COLUMN `menuType`,
    DROP COLUMN `sort`,
    DROP COLUMN `url`,
    DROP COLUMN `urlCode`,
    ADD COLUMN `al_icon` VARCHAR(100) NULL,
    ADD COLUMN `code` VARCHAR(100) NOT NULL,
    ADD COLUMN `father_id` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `icon` VARCHAR(100) NULL,
    ADD COLUMN `is_new_link` BOOLEAN NULL,
    ADD COLUMN `menu_name` VARCHAR(50) NOT NULL,
    ADD COLUMN `menu_type` CHAR(1) NULL,
    ADD COLUMN `orderNum` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `visible` CHAR(1) NOT NULL,
    MODIFY `path` VARCHAR(200) NULL;

-- AlterTable
ALTER TABLE `system_role` 
    DROP COLUMN `created_at`,
    DROP COLUMN `created_by`,
    DROP COLUMN `description`,
    DROP COLUMN `name`,
    DROP COLUMN `status`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `updated_by`,
    ADD COLUMN `role_desc` VARCHAR(255) NULL,
    ADD COLUMN `role_name` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `system_user` ADD COLUMN `department_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `system_department` (
    `id` VARCHAR(191) NOT NULL,
    `department_name` VARCHAR(255) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `father_id` INTEGER NOT NULL DEFAULT 0,
    `order_num` INTEGER NOT NULL DEFAULT 0,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `system_permission_menu_name_key` ON `system_permission`(`menu_name`);

-- CreateIndex
CREATE UNIQUE INDEX `system_permission_code_key` ON `system_permission`(`code`);
