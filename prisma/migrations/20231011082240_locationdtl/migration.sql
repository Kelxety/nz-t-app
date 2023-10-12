-- DropForeignKey
ALTER TABLE `scm_item_location_dtl` DROP FOREIGN KEY `scm_item_location_dtl_ibfk_1`;

-- AddForeignKey
ALTER TABLE `scm_item_location_dtl` ADD CONSTRAINT `scm_item_location_dtl_item_dtl_id_fkey` FOREIGN KEY (`item_dtl_id`) REFERENCES `scm_item_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
