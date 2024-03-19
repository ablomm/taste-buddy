/*
  Warnings:

  - A unique constraint covering the columns `[userID,folderName]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Folder_userID_folderName_key` ON `Folder`(`userID`, `folderName`);
