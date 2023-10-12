/*
  Warnings:

  - You are about to alter the column `status` on the `system_department` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(3))`.
  - You are about to alter the column `status` on the `system_permission` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(2))`.
  - You are about to alter the column `status` on the `system_user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `system_department` MODIFY `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active';

-- AlterTable
ALTER TABLE `system_permission` MODIFY `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active';

-- AlterTable
ALTER TABLE `system_user` MODIFY `status` ENUM('Active', 'Inactive', 'Banned') NOT NULL DEFAULT 'Active';
