/*
  Warnings:

  - A unique constraint covering the columns `[barcode_no]` on the table `scm_receive_dtl` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `scm_receive_dtl_barcode_no_key` ON `scm_receive_dtl`(`barcode_no`);
