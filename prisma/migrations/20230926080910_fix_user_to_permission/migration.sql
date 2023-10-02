-- AlterTable
ALTER TABLE `system_user` MODIFY `department_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `system_user` ADD CONSTRAINT `system_user_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `system_department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
