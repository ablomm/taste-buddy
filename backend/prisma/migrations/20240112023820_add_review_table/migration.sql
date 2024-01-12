/*
  Warnings:

  - Added the required column `averageRating` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePic` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `recipe` ADD COLUMN `averageRating` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `profilePic` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipeID` INTEGER NOT NULL,
    `reviewText` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `userID` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `profilePic` VARCHAR(191) NOT NULL,
    `timePosted` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
