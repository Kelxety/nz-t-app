-- CreateIndex
CREATE FULLTEXT INDEX `scm_item_item_code_barcode_item_name_idx` ON `scm_item`(`item_code`, `barcode`, `item_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `scm_receive_mode_recv_mode_idx` ON `scm_receive_mode`(`recv_mode`);

-- CreateIndex
CREATE FULLTEXT INDEX `scm_supplier_supplier_name_supplier_address_contact_person_c_idx` ON `scm_supplier`(`supplier_name`, `supplier_address`, `contact_person`, `contact_no`);

-- CreateIndex
CREATE FULLTEXT INDEX `scm_unit_unit_name_unit_acro_idx` ON `scm_unit`(`unit_name`, `unit_acro`);

-- CreateIndex
CREATE FULLTEXT INDEX `scm_warehouse_wh_name_wh_acro_idx` ON `scm_warehouse`(`wh_name`, `wh_acro`);
