/*
  Warnings:

  - You are about to drop the column `item_id` on the `scm_item_location_dtl` table. All the data in the column will be lost.
  - Added the required column `item_dtl_id` to the `scm_item_location_dtl` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `scm_item_location_dtl` DROP FOREIGN KEY `scm_item_location_dtl_ibfk_1`;

-- AlterTable
ALTER TABLE `scm_item_location_dtl` DROP COLUMN `item_id`,
    ADD COLUMN `item_dtl_id` VARCHAR(36) NOT NULL;

-- CreateIndex
CREATE INDEX `item_dtl_id` ON `scm_item_location_dtl`(`item_dtl_id`);

-- AddForeignKey
ALTER TABLE `scm_item_location_dtl` ADD CONSTRAINT `scm_item_location_dtl_ibfk_1` FOREIGN KEY (`item_dtl_id`) REFERENCES `scm_item_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
