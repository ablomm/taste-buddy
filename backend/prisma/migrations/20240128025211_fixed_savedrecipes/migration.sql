/*
  Warnings:

  - You are about to drop the `usersavedposts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userID,recipeID]` on the table `UserSavedRecipes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `usersavedposts` DROP FOREIGN KEY `UserSavedPosts_postID_fkey`;

-- DropForeignKey
ALTER TABLE `usersavedposts` DROP FOREIGN KEY `UserSavedPosts_userID_fkey`;

-- DropTable
DROP TABLE `usersavedposts`;

-- CreateIndex
CREATE UNIQUE INDEX `UserSavedRecipes_userID_recipeID_key` ON `UserSavedRecipes`(`userID`, `recipeID`);
