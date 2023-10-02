/*
  Warnings:

  - You are about to alter the column `status` on the `system_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `system_user` MODIFY `status` ENUM('ACTIVE', 'INACTIVE', 'BAN') NOT NULL DEFAULT 'ACTIVE';
