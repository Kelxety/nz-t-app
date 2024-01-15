/*
  Warnings:

  - You are about to drop the column `itemdtl_id` on the `scm_stock_ledger` table. All the data in the column will be lost.
  - You are about to drop the column `itemlocationdtl_id` on the `scm_stock_ledger` table. All the data in the column will be lost.
  - You are about to drop the column `ledgercode_id` on the `scm_stock_ledger` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `itemdtl_id` ON `scm_stock_ledger`;

-- DropIndex
DROP INDEX `itemlocationdtl_id` ON `scm_stock_ledger`;

-- DropIndex
DROP INDEX `ledgercode_id` ON `scm_stock_ledger`;

-- AlterTable
ALTER TABLE `scm_stock_ledger` DROP COLUMN `itemdtl_id`,
    DROP COLUMN `itemlocationdtl_id`,
    DROP COLUMN `ledgercode_id`;
