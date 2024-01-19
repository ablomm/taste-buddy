/*
  Warnings:

  - You are about to drop the column `image` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `recipeImage` on the `recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `posts` DROP COLUMN `image`,
    ADD COLUMN `imageName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `imageUrl` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `recipe` DROP COLUMN `recipeImage`,
    ADD COLUMN `recipeImageName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `recipeImageUrl` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `profilePicName` VARCHAR(191) NOT NULL DEFAULT '';
