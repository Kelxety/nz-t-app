-- CreateIndex
CREATE FULLTEXT INDEX `scm_receive_rcv_refno_purchaserequest_no_deliveryreceipt_no__idx` ON `scm_receive`(`rcv_refno`, `purchaserequest_no`, `deliveryreceipt_no`, `purchaseorder_no`);
