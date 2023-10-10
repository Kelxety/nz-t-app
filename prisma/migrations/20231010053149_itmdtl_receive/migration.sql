/*
  Warnings:

  - Added the required column `balanceQty` to the `scm_item_location_dtl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `scm_item_location_dtl` ADD COLUMN `balanceQty` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `scm_receive_dtl` ADD COLUMN `scm_item_location_dtl` VARCHAR(36) NULL;

-- CreateIndex
CREATE INDEX `scm_item_location_dtl` ON `scm_receive_dtl`(`scm_item_location_dtl`);

-- AddForeignKey
ALTER TABLE `scm_receive_dtl` ADD CONSTRAINT `scm_receive_dtl_scm_item_location_dtl_fkey` FOREIGN KEY (`scm_item_location_dtl`) REFERENCES `scm_item_location_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
