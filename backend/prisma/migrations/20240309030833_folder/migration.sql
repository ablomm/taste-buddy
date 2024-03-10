/*
  Warnings:

  - The primary key for the `usersavedrecipes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `UserSavedRecipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usersavedrecipes` DROP PRIMARY KEY,
    ADD COLUMN `folderID` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `Folder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `folderName` VARCHAR(191) NOT NULL,
    `userID` INTEGER NOT NULL,

    UNIQUE INDEX `Folder_folderName_key`(`folderName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserSavedRecipes` ADD CONSTRAINT `UserSavedRecipes_folderID_fkey` FOREIGN KEY (`folderID`) REFERENCES `Folder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
