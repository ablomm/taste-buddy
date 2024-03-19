/*
  Warnings:

  - You are about to drop the `RecipeTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecipeToRecipeTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_RecipeToRecipeTags` DROP FOREIGN KEY `_RecipeToRecipeTags_A_fkey`;

-- DropForeignKey
ALTER TABLE `_RecipeToRecipeTags` DROP FOREIGN KEY `_RecipeToRecipeTags_B_fkey`;

-- DropTable
DROP TABLE `RecipeTags`;

-- DropTable
DROP TABLE `_RecipeToRecipeTags`;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RecipeTags` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RecipeTags_AB_unique`(`A`, `B`),
    INDEX `_RecipeTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_RecipeTags` ADD CONSTRAINT `_RecipeTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `Recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecipeTags` ADD CONSTRAINT `_RecipeTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
