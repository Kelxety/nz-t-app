-- CreateTable
CREATE TABLE `Newaudit` (
    `id` VARCHAR(191) NOT NULL,
    `userid` INTEGER NOT NULL,
    `checktime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
