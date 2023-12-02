-- AlterTable
ALTER TABLE `recipe` MODIFY `cookTimeHours` INTEGER NULL;

-- AlterTable
ALTER TABLE `recipeinstructions` MODIFY `step` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isModerator` BOOLEAN NOT NULL DEFAULT false;
