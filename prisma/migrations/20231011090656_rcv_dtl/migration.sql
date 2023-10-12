/*
  Warnings:

  - You are about to drop the column `itemlocation_dtl_id` on the `scm_receive_dtl` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `scm_receive_dtl` DROP FOREIGN KEY `scm_receive_dtl_itemlocation_dtl_id_fkey`;

-- AlterTable
ALTER TABLE `scm_receive_dtl` DROP COLUMN `itemlocation_dtl_id`,
    ADD COLUMN `itemlocationdtl_id` VARCHAR(36) NULL;

-- CreateIndex
CREATE INDEX `itemlocationdtl_id` ON `scm_receive_dtl`(`itemlocationdtl_id`);

-- AddForeignKey
ALTER TABLE `scm_receive_dtl` ADD CONSTRAINT `scm_receive_dtl_itemlocationdtl_id_fkey` FOREIGN KEY (`itemlocationdtl_id`) REFERENCES `scm_item_location_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
