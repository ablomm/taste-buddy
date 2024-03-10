/*
  Warnings:

  - You are about to drop the column `folderID` on the `usersavedrecipes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `usersavedrecipes` DROP FOREIGN KEY `UserSavedRecipes_folderID_fkey`;

-- AlterTable
ALTER TABLE `usersavedrecipes` DROP COLUMN `folderID`;

-- CreateTable
CREATE TABLE `_FolderToUserSavedRecipes` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FolderToUserSavedRecipes_AB_unique`(`A`, `B`),
    INDEX `_FolderToUserSavedRecipes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_FolderToUserSavedRecipes` ADD CONSTRAINT `_FolderToUserSavedRecipes_A_fkey` FOREIGN KEY (`A`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FolderToUserSavedRecipes` ADD CONSTRAINT `_FolderToUserSavedRecipes_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserSavedRecipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;