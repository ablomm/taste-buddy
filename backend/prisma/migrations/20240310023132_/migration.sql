/*
  Warnings:

  - You are about to drop the `_foldertousersavedrecipes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_foldertousersavedrecipes` DROP FOREIGN KEY `_FolderToUserSavedRecipes_A_fkey`;

-- DropForeignKey
ALTER TABLE `_foldertousersavedrecipes` DROP FOREIGN KEY `_FolderToUserSavedRecipes_B_fkey`;

-- AlterTable
ALTER TABLE `usersavedrecipes` ADD COLUMN `folderID` INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE `_foldertousersavedrecipes`;

-- AddForeignKey
ALTER TABLE `UserSavedRecipes` ADD CONSTRAINT `UserSavedRecipes_folderID_fkey` FOREIGN KEY (`folderID`) REFERENCES `Folder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
