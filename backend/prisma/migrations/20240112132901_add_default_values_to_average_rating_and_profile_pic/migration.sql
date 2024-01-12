-- AlterTable
ALTER TABLE `recipe` MODIFY `averageRating` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` MODIFY `profilePic` VARCHAR(191) NOT NULL DEFAULT '';
