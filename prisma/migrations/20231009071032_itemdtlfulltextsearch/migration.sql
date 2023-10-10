-- CreateIndex
CREATE FULLTEXT INDEX `scm_item_dtl_subitem_code_barcode_subitem_name_brand_name_idx` ON `scm_item_dtl`(`subitem_code`, `barcode`, `subitem_name`, `brand_name`);
