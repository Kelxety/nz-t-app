/*
  Warnings:

  - A unique constraint covering the columns `[item_code]` on the table `scm_item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subitem_code]` on the table `scm_item_dtl` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barcode]` on the table `scm_item_dtl` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `scm_item_item_code_key` ON `scm_item`(`item_code`);

-- CreateIndex
CREATE UNIQUE INDEX `scm_item_dtl_subitem_code_key` ON `scm_item_dtl`(`subitem_code`);

-- CreateIndex
CREATE UNIQUE INDEX `scm_item_dtl_barcode_key` ON `scm_item_dtl`(`barcode`);
