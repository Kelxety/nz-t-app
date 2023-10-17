-- AlterTable
ALTER TABLE `system_user` ADD COLUMN `office_id` VARCHAR(191) NULL,
    ADD COLUMN `warehouse_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `system_user` ADD CONSTRAINT `system_user_warehouse_id_fkey` FOREIGN KEY (`warehouse_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_user` ADD CONSTRAINT `system_user_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `hospital_office`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
