/*
  Warnings:

  - Added the required column `updated_at` to the `system_permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `system_permission` ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `created_by` VARCHAR(50) NULL,
    ADD COLUMN `updated_at` DATETIME(0) NOT NULL,
    ADD COLUMN `updated_by` VARCHAR(50) NULL;
