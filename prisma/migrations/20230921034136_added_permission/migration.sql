-- CreateTable
CREATE TABLE `system_permission` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `urlCode` VARCHAR(191) NULL,
    `roleId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `system_permission` ADD CONSTRAINT `system_permission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `system_role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
