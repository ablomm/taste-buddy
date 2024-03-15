-- CreateTable
CREATE TABLE `UserRejectedRecipes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER NOT NULL,
    `recipeID` INTEGER NOT NULL,

    UNIQUE INDEX `UserRejectedRecipes_userID_recipeID_key`(`userID`, `recipeID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRejectedRecipes` ADD CONSTRAINT `UserRejectedRecipes_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
