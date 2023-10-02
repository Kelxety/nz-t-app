-- AlterTable
ALTER TABLE `system_permission` ADD COLUMN `menuType` VARCHAR(191) NULL,
    ADD COLUMN `path` VARCHAR(191) NULL,
    ADD COLUMN `sort` INTEGER NULL;
