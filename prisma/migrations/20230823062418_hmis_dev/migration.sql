-- CreateTable
CREATE TABLE `system_user` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NULL,
    `account_name` VARCHAR(50) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `middle_name` VARCHAR(50) NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `description` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `system_user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hospital_office` (
    `id` VARCHAR(191) NOT NULL,
    `office_name` VARCHAR(255) NULL,
    `office_acro` VARCHAR(50) NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hospital_patient` (
    `id` VARCHAR(191) NOT NULL,
    `fy_code` INTEGER NULL,
    `patient_name` VARCHAR(255) NULL,
    `first_name` VARCHAR(100) NULL,
    `middle_name` VARCHAR(100) NULL,
    `last_name` VARCHAR(100) NULL,
    `ext_name` VARCHAR(50) NULL,
    `address` VARCHAR(255) NULL,
    `civil_status` VARCHAR(50) NULL,
    `nationality` VARCHAR(50) NULL,
    `contact_no` VARCHAR(50) NULL,
    `gender` VARCHAR(50) NULL,
    `birthdate` DATE NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hospital_patient_type` (
    `id` VARCHAR(191) NOT NULL,
    `patient_typename` VARCHAR(255) NULL,
    `is_patientselect` BOOLEAN NULL,
    `state` VARCHAR(20) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hospital_physician` (
    `id` VARCHAR(191) NOT NULL,
    `physician_name` VARCHAR(150) NOT NULL,
    `designation` VARCHAR(150) NULL,
    `specialty` VARCHAR(255) NULL,
    `prc_no` VARCHAR(50) NULL,
    `prc_validity` DATE NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hospital_profile` (
    `id` VARCHAR(191) NOT NULL,
    `agency_name` VARCHAR(255) NOT NULL,
    `agency_acro` VARCHAR(50) NULL,
    `agency_address` VARCHAR(255) NULL,
    `rcenter` VARCHAR(50) NULL,
    `agency_logo` VARCHAR(100) NULL,
    `pgp_logo` VARCHAR(100) NULL,
    `state` VARCHAR(25) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_adjustment` (
    `id` VARCHAR(191) NOT NULL,
    `fy_code` INTEGER NOT NULL,
    `adj_refno` VARCHAR(30) NOT NULL,
    `adj_date` DATE NOT NULL,
    `warehouse_id` VARCHAR(36) NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `is_approved` BOOLEAN NULL,
    `approved_by` VARCHAR(50) NULL,
    `approved_at` DATETIME(0) NULL,
    `is_posted` BOOLEAN NULL,
    `posted_by` VARCHAR(50) NULL,
    `posted_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `warehouse_id`(`warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_adjustment_dtl` (
    `id` VARCHAR(191) NOT NULL,
    `adjustment_id` VARCHAR(36) NULL,
    `itemdtl_id` VARCHAR(36) NULL,
    `adj_mode` VARCHAR(30) NULL,
    `qty` INTEGER NULL,
    `cost` DOUBLE NULL,
    `price` DOUBLE NULL,
    `cost_amount` DOUBLE NULL,
    `price_amount` DOUBLE NULL,

    INDEX `adjustment_id`(`adjustment_id`),
    INDEX `itemdtl_id`(`itemdtl_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_bad_order` (
    `id` VARCHAR(191) NOT NULL,
    `fy_code` INTEGER NOT NULL,
    `bo_refno` VARCHAR(30) NOT NULL,
    `bo_date` DATE NOT NULL,
    `warehouse_id` VARCHAR(36) NOT NULL,
    `supplier_id` VARCHAR(36) NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `is_posted` BOOLEAN NULL,
    `posted_by` VARCHAR(50) NULL,
    `posted_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `supplier_id`(`supplier_id`),
    INDEX `warehouse_id`(`warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_bad_order_dtl` (
    `id` VARCHAR(191) NOT NULL,
    `badorder_id` VARCHAR(36) NOT NULL,
    `itemdtl_id` VARCHAR(36) NOT NULL,
    `qty` INTEGER NOT NULL,
    `cost` DOUBLE NULL,
    `price` DOUBLE NULL,
    `cost_amount` DOUBLE NULL,
    `price_amount` DOUBLE NULL,

    INDEX `badorder_id`(`badorder_id`),
    INDEX `itemdtl_id`(`itemdtl_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_chargeslip` (
    `id` VARCHAR(191) NOT NULL,
    `fy_code` INTEGER NOT NULL,
    `cs_refno` VARCHAR(50) NOT NULL,
    `cs_date` DATE NOT NULL,
    `cs_name` VARCHAR(255) NOT NULL,
    `patienttype_id` VARCHAR(36) NOT NULL,
    `physician_id` VARCHAR(36) NULL,
    `patient_id` VARCHAR(36) NOT NULL,
    `warehouse_id` VARCHAR(36) NOT NULL,
    `amount` DOUBLE NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `is_posted` BOOLEAN NULL,
    `posted_by` VARCHAR(50) NULL,
    `posted_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `scm_chargeslip_patienttype_id_key`(`patienttype_id`),
    INDEX `patient_id`(`patient_id`),
    INDEX `patienttype_id`(`patienttype_id`),
    INDEX `physician_id`(`physician_id`),
    INDEX `warehouse_id`(`warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_chargeslip_dtl` (
    `id` VARCHAR(191) NOT NULL,
    `chargeslip_id` VARCHAR(36) NULL,
    `itemdtl_id` VARCHAR(36) NULL,
    `price` DOUBLE NULL,
    `qty` INTEGER NULL,
    `price_amount` DOUBLE NULL,
    `patienttypeId` VARCHAR(191) NOT NULL,

    INDEX `chargeslip_id`(`chargeslip_id`),
    INDEX `itemdtl_id`(`itemdtl_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_issuance` (
    `id` VARCHAR(191) NOT NULL,
    `fy_code` INTEGER NULL,
    `iss_refno` VARCHAR(15) NULL,
    `iss_date` DATE NULL,
    `warehouse_id` VARCHAR(36) NULL,
    `office_id` VARCHAR(36) NULL,
    `ris_id` VARCHAR(36) NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `is_ris` BOOLEAN NULL,
    `is_posted` BOOLEAN NULL,
    `posted_by` VARCHAR(50) NULL,
    `posted_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `office_id`(`office_id`),
    INDEX `ris_id`(`ris_id`),
    INDEX `warehouse_id`(`warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_issuance_dtl` (
    `id` VARCHAR(191) NOT NULL,
    `issuance_id` VARCHAR(36) NULL,
    `itemdtl_id` VARCHAR(36) NULL,
    `qty_requested` INTEGER NULL,
    `cost` DOUBLE NULL,
    `cost_amount` DOUBLE NULL,
    `qty_granted` INTEGER NULL,

    INDEX `issuance_id`(`issuance_id`),
    INDEX `itemdtl_id`(`itemdtl_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_item` (
    `id` VARCHAR(191) NOT NULL,
    `item_code` VARCHAR(36) NULL,
    `barcode` VARCHAR(50) NULL,
    `item_name` VARCHAR(255) NULL,
    `item_description` VARCHAR(50) NULL,
    `itemcategory_id` VARCHAR(36) NULL,
    `unit_id` VARCHAR(36) NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `itemcategory_id`(`itemcategory_id`),
    INDEX `unit_id`(`unit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_item_category` (
    `id` VARCHAR(191) NOT NULL,
    `parent_id` VARCHAR(50) NULL,
    `cat_name` VARCHAR(150) NULL,
    `cat_acro` VARCHAR(50) NULL,
    `sort_order` INTEGER NULL,
    `state` VARCHAR(20) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_item_dtl` (
    `id` VARCHAR(191) NOT NULL,
    `fy_code` INTEGER NULL,
    `entry_date` DATE NOT NULL,
    `item_id` VARCHAR(36) NOT NULL,
    `parent_id` VARCHAR(36) NULL,
    `subitem_code` VARCHAR(50) NULL,
    `subitem_name` VARCHAR(255) NOT NULL,
    `barcode` VARCHAR(36) NULL,
    `unit_id` VARCHAR(36) NULL,
    `brand_name` VARCHAR(150) NULL,
    `lot_no` VARCHAR(150) NULL,
    `batch_no` VARCHAR(150) NULL,
    `expiration_date` DATE NULL,
    `cost` DOUBLE NULL,
    `price` DOUBLE NULL,
    `markup` DOUBLE NULL,
    `balance_qty` INTEGER NULL,
    `rr_mode` VARCHAR(50) NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `item_id`(`item_id`),
    INDEX `unit_id`(`unit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_item_location` (
    `id` VARCHAR(191) NOT NULL,
    `warehouse_id` VARCHAR(36) NULL,
    `loc_name` VARCHAR(150) NULL,
    `state` VARCHAR(20) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `warehouse_id`(`warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_item_location_dtl` (
    `id` VARCHAR(191) NOT NULL,
    `item_id` VARCHAR(36) NOT NULL,
    `location_id` VARCHAR(36) NOT NULL,

    INDEX `item_id`(`item_id`),
    INDEX `location_id`(`location_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_item_rate_history` (
    `id` VARCHAR(191) NOT NULL,
    `itemdtl_id` VARCHAR(36) NULL,
    `last_cost` DOUBLE NULL,
    `last_price` DOUBLE NULL,
    `last_markup` DOUBLE NULL,
    `cost` DOUBLE NULL,
    `price` DOUBLE NULL,
    `markup` DOUBLE NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `itemdtl_id`(`itemdtl_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_ledger_code` (
    `id` VARCHAR(191) NOT NULL,
    `ledger_code` VARCHAR(36) NOT NULL,
    `ledger_name` VARCHAR(150) NOT NULL,
    `ledger_desc` VARCHAR(50) NULL,
    `ledger_flag` VARCHAR(50) NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_receive` (
    `id` VARCHAR(191) NOT NULL,
    `fy_code` INTEGER NOT NULL,
    `rcv_date` DATE NOT NULL,
    `rcv_refno` VARCHAR(30) NOT NULL,
    `warehouse_id` VARCHAR(36) NOT NULL,
    `supplier_id` VARCHAR(36) NOT NULL,
    `receivemode_id` VARCHAR(36) NOT NULL,
    `purchaserequest_no` VARCHAR(30) NULL,
    `deliveryreceipt_no` VARCHAR(30) NULL,
    `purchaseorder_no` VARCHAR(30) NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `is_posted` BOOLEAN NULL,
    `posted_by` VARCHAR(50) NULL,
    `posted_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `receivemode_id`(`receivemode_id`),
    INDEX `supplier_id`(`supplier_id`),
    INDEX `warehouse_id`(`warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_receive_dtl` (
    `id` VARCHAR(191) NOT NULL,
    `receive_id` VARCHAR(36) NULL,
    `itemdtl_id` VARCHAR(36) NULL,
    `qty` INTEGER NULL,
    `cost` DOUBLE NULL,
    `cost_amount` DOUBLE NULL,
    `lot_no` VARCHAR(50) NULL,
    `batch_no` VARCHAR(50) NULL,
    `expiration_date` DATE NULL,
    `barcode_no` VARCHAR(50) NULL,

    INDEX `itemdtl_id`(`itemdtl_id`),
    INDEX `receive_id`(`receive_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_receive_mode` (
    `id` VARCHAR(191) NOT NULL,
    `recv_mode` VARCHAR(150) NOT NULL,
    `state` VARCHAR(20) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_release` (
    `id` VARCHAR(191) NOT NULL,
    `fy_code` INTEGER NULL,
    `rel_date` DATE NULL,
    `rel_refno` VARCHAR(30) NULL,
    `request_id` VARCHAR(36) NULL,
    `warehouse_id` VARCHAR(36) NULL,
    `requestfrom_id` VARCHAR(36) NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `is_posted` BOOLEAN NULL,
    `posted_by` VARCHAR(50) NULL,
    `posted_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_approved` BOOLEAN NULL,
    `approved_by` VARCHAR(50) NULL,
    `approved_at` DATETIME(0) NULL,
    `is_rejected` BOOLEAN NULL,
    `rejected_by` VARCHAR(50) NULL,
    `rejected_at` DATETIME(0) NULL,
    `is_released` BOOLEAN NULL,
    `released_by` VARCHAR(50) NULL,
    `released_at` DATETIME(0) NULL,

    INDEX `request_id`(`request_id`),
    INDEX `requestfrom_id`(`requestfrom_id`),
    INDEX `warehouse_id`(`warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_release_dtl` (
    `id` VARCHAR(191) NOT NULL,
    `release_id` VARCHAR(36) NULL,
    `itemdtl_id` VARCHAR(36) NULL,
    `qty_requested` INTEGER NULL,
    `qty_approved` INTEGER NULL,
    `qty_released` INTEGER NULL,
    `qty_received` INTEGER NULL,
    `cost` DOUBLE NULL,
    `cost_amount` DOUBLE NULL,

    INDEX `itemdtl_id`(`itemdtl_id`),
    INDEX `release_id`(`release_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_request` (
    `id` VARCHAR(191) NOT NULL,
    `fy_code` INTEGER NOT NULL,
    `req_refno` VARCHAR(30) NOT NULL,
    `req_date` DATE NOT NULL,
    `warehouse_id` VARCHAR(36) NOT NULL,
    `requestto_id` VARCHAR(36) NOT NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `is_posted` DOUBLE NULL,
    `posted_by` VARCHAR(50) NULL,
    `posted_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_received` BOOLEAN NULL,
    `received_by` VARCHAR(50) NULL,
    `received_at` DATETIME(0) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `requestto_id`(`requestto_id`),
    INDEX `warehouse_id`(`warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_request_dtl` (
    `id` VARCHAR(191) NOT NULL,
    `request_id` VARCHAR(36) NULL,
    `itemdtl_id` VARCHAR(36) NULL,
    `qty_request` INTEGER NULL,
    `cost` DOUBLE NULL,
    `cost_amount` DOUBLE NULL,
    `qty_received` DOUBLE NULL,
    `qty_balance` INTEGER NULL,

    INDEX `itemdtl_id`(`itemdtl_id`),
    INDEX `request_id`(`request_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_return` (
    `id` VARCHAR(191) NOT NULL,
    `fy_code` INTEGER NOT NULL,
    `sret_date` DATE NOT NULL,
    `sret_refno` VARCHAR(25) NOT NULL,
    `warehouse_id` VARCHAR(36) NOT NULL,
    `chargeslip_id` VARCHAR(36) NOT NULL,
    `patient_name` VARCHAR(155) NOT NULL,
    `state` VARCHAR(20) NOT NULL,
    `remarks` VARCHAR(255) NULL,
    `is_posted` BOOLEAN NULL,
    `posted_by` VARCHAR(50) NULL,
    `posted_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `chargeslip_id`(`chargeslip_id`),
    INDEX `warehouse_id`(`warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_return_dtl` (
    `id` VARCHAR(191) NOT NULL,
    `return_id` VARCHAR(36) NULL,
    `itemdtl_id` VARCHAR(36) NULL,
    `qty` INTEGER NULL,
    `cost` DOUBLE NULL,
    `price` DOUBLE NULL,
    `cost_amount` DOUBLE NULL,
    `price_amount` DOUBLE NULL,

    INDEX `itemdtl_id`(`itemdtl_id`),
    INDEX `return_id`(`return_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_ris` (
    `id` VARCHAR(191) NOT NULL,
    `fy_code` INTEGER NULL,
    `ris_refno` VARCHAR(30) NULL,
    `ris_date` DATE NULL,
    `office_id` VARCHAR(36) NULL,
    `is_received` BOOLEAN NULL,
    `received_by` VARCHAR(50) NULL,
    `received_at` DATETIME(0) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `office_id`(`office_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_ris_dtl` (
    `id` VARCHAR(191) NOT NULL,
    `ris_id` VARCHAR(36) NULL,
    `itemdtl_id` VARCHAR(36) NULL,
    `qty_request` INTEGER NULL,
    `qty_received` INTEGER NULL,

    INDEX `itemdtl_id`(`itemdtl_id`),
    INDEX `ris_id`(`ris_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_stock_inventory` (
    `id` VARCHAR(191) NOT NULL,
    `fy_code` INTEGER NULL,
    `inv_date` DATETIME(0) NULL,
    `inv_refno` VARCHAR(30) NULL,
    `warehouse_id` VARCHAR(36) NULL,
    `description` VARCHAR(255) NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `is_posted` BOOLEAN NULL,
    `posted_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `posted_by` VARCHAR(50) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `warehouse_id`(`warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_stock_inventory_dtl` (
    `id` VARCHAR(191) NOT NULL,
    `stockinventroy_id` VARCHAR(36) NULL,
    `itemlocationdtl_id` VARCHAR(36) NULL,
    `itemdtl_id` VARCHAR(36) NULL,
    `qty_endingbalance` INTEGER NULL,
    `qty_physicalcount` INTEGER NULL,
    `qty_variance` INTEGER NULL,

    INDEX `itemdtl_id`(`itemdtl_id`),
    INDEX `itemlocationdtl_id`(`itemlocationdtl_id`),
    INDEX `stockinventroy_id`(`stockinventroy_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

    INDEX `itemdtl_id`(`itemdtl_id`),
    INDEX `itemlocationdtl_id`(`itemlocationdtl_id`),
    INDEX `ledgercode_id`(`ledgercode_id`),
    INDEX `warehouse_id`(`warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_supplier` (
    `id` VARCHAR(191) NOT NULL,
    `supplier_name` VARCHAR(150) NOT NULL,
    `supplier_address` VARCHAR(255) NULL,
    `receivemode_id` VARCHAR(36) NULL,
    `contact_person` VARCHAR(150) NULL,
    `contact_no` INTEGER NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `receivemode_id`(`receivemode_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_transfer` (
    `id` VARCHAR(191) NOT NULL,
    `fy_code` INTEGER NULL,
    `tf_date` DATE NULL,
    `tf_refno` VARCHAR(30) NULL,
    `warehouse_id` VARCHAR(36) NULL,
    `state` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `is_posted` BOOLEAN NULL,
    `posted_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `posted_by` VARCHAR(50) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_transfer_dtl` (
    `id` VARCHAR(191) NOT NULL,
    `transfer_id` VARCHAR(36) NULL,
    `itemlocation_from` VARCHAR(36) NULL,
    `qty_transfered` INTEGER NULL,
    `itemlocation_to` VARCHAR(36) NULL,
    `qty_received` INTEGER NULL,
    `remarks` VARCHAR(255) NULL,

    INDEX `transfer_id`(`transfer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_unit` (
    `id` VARCHAR(191) NOT NULL,
    `unit_name` VARCHAR(150) NULL,
    `unit_acro` VARCHAR(50) NULL,
    `state` VARCHAR(20) NULL,
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scm_warehouse` (
    `id` VARCHAR(191) NOT NULL,
    `wh_name` VARCHAR(150) NOT NULL,
    `wh_acro` VARCHAR(50) NOT NULL,
    `state` VARCHAR(20) NULL DEFAULT 'active',
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `scm_warehouse_wh_acro_key`(`wh_acro`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_refresh_token` (
    `id` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(255) NOT NULL,
    `validity` DATETIME(3) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `system_refresh_token_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_role` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `created_by` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `system_role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_system_user_role` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_system_user_role_AB_unique`(`A`, `B`),
    INDEX `_system_user_role_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `scm_adjustment` ADD CONSTRAINT `scm_adjustment_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_adjustment_dtl` ADD CONSTRAINT `scm_adjustment_dtl_ibfk_1` FOREIGN KEY (`adjustment_id`) REFERENCES `scm_adjustment`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_adjustment_dtl` ADD CONSTRAINT `scm_adjustment_dtl_ibfk_2` FOREIGN KEY (`itemdtl_id`) REFERENCES `scm_item_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_bad_order` ADD CONSTRAINT `scm_bad_order_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_bad_order` ADD CONSTRAINT `scm_bad_order_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `scm_supplier`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_bad_order_dtl` ADD CONSTRAINT `scm_bad_order_dtl_ibfk_1` FOREIGN KEY (`badorder_id`) REFERENCES `scm_bad_order`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_bad_order_dtl` ADD CONSTRAINT `scm_bad_order_dtl_ibfk_2` FOREIGN KEY (`itemdtl_id`) REFERENCES `scm_item_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_chargeslip` ADD CONSTRAINT `scm_chargeslip_ibfk_1` FOREIGN KEY (`patienttype_id`) REFERENCES `hospital_patient_type`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_chargeslip` ADD CONSTRAINT `scm_chargeslip_ibfk_2` FOREIGN KEY (`physician_id`) REFERENCES `hospital_physician`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_chargeslip` ADD CONSTRAINT `scm_chargeslip_ibfk_3` FOREIGN KEY (`patient_id`) REFERENCES `hospital_patient`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_chargeslip` ADD CONSTRAINT `scm_chargeslip_ibfk_4` FOREIGN KEY (`warehouse_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_chargeslip_dtl` ADD CONSTRAINT `scm_chargeslip_dtl_ibfk_1` FOREIGN KEY (`chargeslip_id`) REFERENCES `scm_chargeslip`(`patienttype_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_chargeslip_dtl` ADD CONSTRAINT `scm_chargeslip_dtl_ibfk_2` FOREIGN KEY (`itemdtl_id`) REFERENCES `scm_item_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_issuance` ADD CONSTRAINT `scm_issuance_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_issuance` ADD CONSTRAINT `scm_issuance_ibfk_2` FOREIGN KEY (`office_id`) REFERENCES `hospital_office`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_issuance` ADD CONSTRAINT `scm_issuance_ibfk_3` FOREIGN KEY (`ris_id`) REFERENCES `scm_ris`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_issuance_dtl` ADD CONSTRAINT `scm_issuance_dtl_ibfk_1` FOREIGN KEY (`issuance_id`) REFERENCES `scm_issuance`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_issuance_dtl` ADD CONSTRAINT `scm_issuance_dtl_ibfk_2` FOREIGN KEY (`itemdtl_id`) REFERENCES `scm_item_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_item` ADD CONSTRAINT `scm_item_ibfk_1` FOREIGN KEY (`itemcategory_id`) REFERENCES `scm_item_category`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_item` ADD CONSTRAINT `scm_item_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `scm_unit`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_item_dtl` ADD CONSTRAINT `scm_item_dtl_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `scm_item`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_item_dtl` ADD CONSTRAINT `scm_item_dtl_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `scm_unit`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_item_location` ADD CONSTRAINT `scm_item_location_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_item_location_dtl` ADD CONSTRAINT `scm_item_location_dtl_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `scm_item`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_item_location_dtl` ADD CONSTRAINT `scm_item_location_dtl_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `scm_item_location`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_item_rate_history` ADD CONSTRAINT `scm_item_rate_history_ibfk_1` FOREIGN KEY (`itemdtl_id`) REFERENCES `scm_item_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_receive` ADD CONSTRAINT `scm_receive_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_receive` ADD CONSTRAINT `scm_receive_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `scm_supplier`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_receive` ADD CONSTRAINT `scm_receive_ibfk_3` FOREIGN KEY (`receivemode_id`) REFERENCES `scm_receive_mode`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_receive_dtl` ADD CONSTRAINT `scm_receive_dtl_ibfk_1` FOREIGN KEY (`receive_id`) REFERENCES `scm_receive`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_receive_dtl` ADD CONSTRAINT `scm_receive_dtl_ibfk_2` FOREIGN KEY (`itemdtl_id`) REFERENCES `scm_item_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_release` ADD CONSTRAINT `scm_release_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `scm_request`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_release` ADD CONSTRAINT `scm_release_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_release` ADD CONSTRAINT `scm_release_ibfk_3` FOREIGN KEY (`requestfrom_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_release_dtl` ADD CONSTRAINT `scm_release_dtl_ibfk_2` FOREIGN KEY (`itemdtl_id`) REFERENCES `scm_item_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_release_dtl` ADD CONSTRAINT `scm_release_dtl_ibfk_3` FOREIGN KEY (`release_id`) REFERENCES `scm_release`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_request` ADD CONSTRAINT `scm_request_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_request` ADD CONSTRAINT `scm_request_ibfk_2` FOREIGN KEY (`requestto_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_request_dtl` ADD CONSTRAINT `scm_request_dtl_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `scm_request`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_request_dtl` ADD CONSTRAINT `scm_request_dtl_ibfk_2` FOREIGN KEY (`itemdtl_id`) REFERENCES `scm_item_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_return` ADD CONSTRAINT `scm_return_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_return` ADD CONSTRAINT `scm_return_ibfk_3` FOREIGN KEY (`chargeslip_id`) REFERENCES `scm_chargeslip`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_return_dtl` ADD CONSTRAINT `scm_return_dtl_ibfk_1` FOREIGN KEY (`return_id`) REFERENCES `scm_return`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_return_dtl` ADD CONSTRAINT `scm_return_dtl_ibfk_2` FOREIGN KEY (`itemdtl_id`) REFERENCES `scm_item_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_ris` ADD CONSTRAINT `scm_ris_ibfk_1` FOREIGN KEY (`office_id`) REFERENCES `hospital_office`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_ris_dtl` ADD CONSTRAINT `scm_ris_dtl_ibfk_1` FOREIGN KEY (`ris_id`) REFERENCES `scm_ris`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_ris_dtl` ADD CONSTRAINT `scm_ris_dtl_ibfk_2` FOREIGN KEY (`itemdtl_id`) REFERENCES `scm_item_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_stock_inventory` ADD CONSTRAINT `scm_stock_inventory_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_stock_inventory_dtl` ADD CONSTRAINT `scm_stock_inventory_dtl_ibfk_1` FOREIGN KEY (`stockinventroy_id`) REFERENCES `scm_stock_inventory`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_stock_inventory_dtl` ADD CONSTRAINT `scm_stock_inventory_dtl_ibfk_2` FOREIGN KEY (`itemlocationdtl_id`) REFERENCES `scm_item_location_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_stock_inventory_dtl` ADD CONSTRAINT `scm_stock_inventory_dtl_ibfk_3` FOREIGN KEY (`itemdtl_id`) REFERENCES `scm_item_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_stock_ledger` ADD CONSTRAINT `scm_stock_ledger_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `scm_warehouse`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_stock_ledger` ADD CONSTRAINT `scm_stock_ledger_ibfk_2` FOREIGN KEY (`itemlocationdtl_id`) REFERENCES `scm_item_location_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_stock_ledger` ADD CONSTRAINT `scm_stock_ledger_ibfk_3` FOREIGN KEY (`itemdtl_id`) REFERENCES `scm_item_dtl`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_stock_ledger` ADD CONSTRAINT `scm_stock_ledger_ibfk_4` FOREIGN KEY (`ledgercode_id`) REFERENCES `scm_ledger_code`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_supplier` ADD CONSTRAINT `scm_supplier_ibfk_1` FOREIGN KEY (`receivemode_id`) REFERENCES `scm_receive_mode`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scm_transfer_dtl` ADD CONSTRAINT `scm_transfer_dtl_ibfk_1` FOREIGN KEY (`transfer_id`) REFERENCES `scm_transfer`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `system_refresh_token` ADD CONSTRAINT `system_refresh_token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `system_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_system_user_role` ADD CONSTRAINT `_system_user_role_A_fkey` FOREIGN KEY (`A`) REFERENCES `system_role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_system_user_role` ADD CONSTRAINT `_system_user_role_B_fkey` FOREIGN KEY (`B`) REFERENCES `system_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
