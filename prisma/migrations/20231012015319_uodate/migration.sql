-- DropForeignKey
ALTER TABLE `scm_receive_dtl` DROP FOREIGN KEY `scm_receive_dtl_itemlocationdtl_id_fkey`;

-- AddForeignKey
ALTER TABLE `scm_receive_dtl` ADD CONSTRAINT `scm_receive_dtl_ibfk_3` FOREIGN KEY (`itemlocationdtl_id`) REFERENCES `scm_item_location_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
