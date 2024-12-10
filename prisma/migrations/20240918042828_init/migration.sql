-- CreateTable
CREATE TABLE `Menu` (
    `idMenu` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `price` INTEGER NOT NULL DEFAULT 0,
    `category` ENUM('FOOD', 'DRINK', 'SNACK') NOT NULL DEFAULT 'FOOD',
    `picture` VARCHAR(191) NOT NULL DEFAULT '',
    `description` TEXT NOT NULL DEFAULT '',

    UNIQUE INDEX `Menu_uuid_key`(`uuid`),
    PRIMARY KEY (`idMenu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `idUser` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `profile_picture` VARCHAR(191) NOT NULL DEFAULT '',
    `role` ENUM('MANAGER', 'CASHIER') NOT NULL DEFAULT 'CASHIER',

    UNIQUE INDEX `User_uuid_key`(`uuid`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `idOrder` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `customer` VARCHAR(191) NOT NULL DEFAULT '',
    `table_number` VARCHAR(191) NOT NULL DEFAULT '',
    `total_price` INTEGER NOT NULL DEFAULT 0,
    `payment_method` ENUM('CASH', 'QRIS') NOT NULL DEFAULT 'CASH',
    `status` ENUM('NEW', 'PAID', 'DONE') NOT NULL DEFAULT 'NEW',
    `idUser` INTEGER NULL,

    UNIQUE INDEX `Order_uuid_key`(`uuid`),
    PRIMARY KEY (`idOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderList` (
    `idOrderList` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `note` TEXT NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `idOrder` INTEGER NULL,
    `idMenu` INTEGER NULL,

    UNIQUE INDEX `OrderList_uuid_key`(`uuid`),
    PRIMARY KEY (`idOrderList`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`idUser`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderList` ADD CONSTRAINT `OrderList_idOrder_fkey` FOREIGN KEY (`idOrder`) REFERENCES `Order`(`idOrder`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderList` ADD CONSTRAINT `OrderList_idMenu_fkey` FOREIGN KEY (`idMenu`) REFERENCES `Menu`(`idMenu`) ON DELETE SET NULL ON UPDATE CASCADE;
