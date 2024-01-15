-- CreateTable
CREATE TABLE `scm_stock_ledger` (
    `id` VARCHAR(191) NOT NULL,
    `fy_code` INTEGER NULL,
    `entry_date` DATE NULL,
    `warehouse_id` VARCHAR(36) NULL,
    `itemlocationdtl_id` VARCHAR(36) NULL,
    `itemdtl_id` VARCHAR(36) NULL,
    `ledgercode_id` VARCHAR(36) NULL,
    `refno` VARCHAR(30) NULL,
    `refdate` DATE NULL,
    `qty` INTEGER NULL,
    `cost` DOUBLE NULL,
    `price` DOUBLE NULL,
    `posted_by` VARCHAR(50) NULL,
    `posted_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `remarks` VARCHAR(30) NULL,
    `transaction_id` VARCHAR(100) NULL,

    INDEX `itemdtl_id`(`itemdtl_id`),
    INDEX `itemlocationdtl_id`(`itemlocationdtl_id`),
    INDEX `ledgercode_id`(`ledgercode_id`),
    INDEX `warehouse_id`(`warehouse_id`),
    FULLTEXT INDEX `scm_stock_ledger_refno_remarks_idx`(`refno`, `remarks`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `scm_stock_ledger` ADD CONSTRAINT `scm_stock_ledger_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
