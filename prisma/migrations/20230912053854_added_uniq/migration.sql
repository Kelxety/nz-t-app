/*
  Warnings:

  - A unique constraint covering the columns `[item_name]` on the table `scm_item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subitem_name]` on the table `scm_item_dtl` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `scm_item_item_name_key` ON `scm_item`(`item_name`);

-- CreateIndex
CREATE UNIQUE INDEX `scm_item_dtl_subitem_name_key` ON `scm_item_dtl`(`subitem_name`);
