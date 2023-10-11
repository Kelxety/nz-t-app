/*
  Warnings:

  - You are about to drop the column `scm_item_location_dtl` on the `scm_receive_dtl` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `scm_receive_dtl` DROP FOREIGN KEY `scm_receive_dtl_scm_item_location_dtl_fkey`;

-- AlterTable
ALTER TABLE `scm_receive_dtl` DROP COLUMN `scm_item_location_dtl`,
    ADD COLUMN `itemlocation_dtl_id` VARCHAR(36) NULL;

-- CreateIndex
CREATE INDEX `itemlocation_dtl_id` ON `scm_receive_dtl`(`itemlocation_dtl_id`);

-- AddForeignKey
ALTER TABLE `scm_receive_dtl` ADD CONSTRAINT `scm_receive_dtl_itemlocation_dtl_id_fkey` FOREIGN KEY (`itemlocation_dtl_id`) REFERENCES `scm_item_location_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
