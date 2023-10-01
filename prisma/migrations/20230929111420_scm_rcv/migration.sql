-- CreateIndex
CREATE FULLTEXT INDEX `scm_receive_rcv_refno_idx` ON `scm_receive`(`rcv_refno`);

-- CreateIndex
CREATE FULLTEXT INDEX `scm_receive_purchaserequest_no_idx` ON `scm_receive`(`purchaserequest_no`);

-- CreateIndex
CREATE FULLTEXT INDEX `scm_receive_deliveryreceipt_no_idx` ON `scm_receive`(`deliveryreceipt_no`);

-- CreateIndex
CREATE FULLTEXT INDEX `scm_receive_purchaseorder_no_idx` ON `scm_receive`(`purchaseorder_no`);
