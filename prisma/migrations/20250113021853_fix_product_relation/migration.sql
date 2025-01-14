/*
  Warnings:

  - You are about to drop the column `merchant_id` on the `product` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_merchant_id_fkey`;

-- DropIndex
DROP INDEX `Product_merchant_id_fkey` ON `product`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `merchant_id`,
    ADD COLUMN `category_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
