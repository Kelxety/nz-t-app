/*
  Warnings:

  - You are about to drop the column `rr_mode` on the `scm_item_dtl` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `scm_item_dtl` DROP COLUMN `rr_mode`,
    ADD COLUMN `rrModeId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `scm_item_dtl` ADD CONSTRAINT `scm_receive_mode_ibfk_1` FOREIGN KEY (`rrModeId`) REFERENCES `scm_receive_mode`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;
