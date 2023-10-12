/*
  Warnings:

  - You are about to drop the column `balanceQty` on the `scm_item_location_dtl` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `scm_item_location_dtl` DROP COLUMN `balanceQty`,
    ADD COLUMN `balance_qty` INTEGER NULL;
