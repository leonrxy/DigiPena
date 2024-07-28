/*
  Warnings:

  - You are about to drop the column `content` on the `article_comments` table. All the data in the column will be lost.
  - Added the required column `comment` to the `article_comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `article_categories` MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `article_comments` DROP COLUMN `content`,
    ADD COLUMN `comment` VARCHAR(191) NOT NULL,
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `articles` MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `user_profiles` MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `users` MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
