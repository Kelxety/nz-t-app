/*
  Warnings:

  - A unique constraint covering the columns `[supplier_name]` on the table `scm_supplier` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `scm_supplier_supplier_name_key` ON `scm_supplier`(`supplier_name`);
