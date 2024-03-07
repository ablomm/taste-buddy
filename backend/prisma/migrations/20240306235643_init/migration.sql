-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isModerator` BOOLEAN NOT NULL DEFAULT false,
    `profilePic` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSavedRecipes` (
    `userID` INTEGER NOT NULL,
    `recipeID` INTEGER NOT NULL,
    `timeSaved` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isShowing` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `UserSavedRecipes_userID_recipeID_key`(`userID`, `recipeID`),
    PRIMARY KEY (`userID`, `recipeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DietaryPref` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `authorID` INTEGER NOT NULL,
    `dietaryPref` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `authorID` INTEGER NOT NULL,
    `creationTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `recipeTitle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `cookTimeHours` INTEGER NULL,
    `cootTimeMinutes` INTEGER NOT NULL,
    `calories` INTEGER NULL,
    `servings` INTEGER NOT NULL,
    `recipeImage` VARCHAR(191) NOT NULL,
    `averageRating` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecipeIngredients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipeID` INTEGER NOT NULL,
    `ingredient` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `measurementType` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecipeInstructions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipeID` INTEGER NOT NULL,
    `step` INTEGER NULL,
    `instruction` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecipeTags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tag` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `author` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `tags` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `recipeURL` VARCHAR(191) NOT NULL,
    `creationTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPosts` (
    `postID` INTEGER NOT NULL,
    `author` INTEGER NOT NULL,

    UNIQUE INDEX `UserPosts_postID_key`(`postID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostTags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postID` INTEGER NOT NULL,
    `tag` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipeID` INTEGER NOT NULL,
    `reviewText` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `userID` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `profilePic` VARCHAR(191) NOT NULL,
    `timePosted` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RecipeToRecipeTags` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RecipeToRecipeTags_AB_unique`(`A`, `B`),
    INDEX `_RecipeToRecipeTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserSavedRecipes` ADD CONSTRAINT `UserSavedRecipes_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSavedRecipes` ADD CONSTRAINT `UserSavedRecipes_recipeID_fkey` FOREIGN KEY (`recipeID`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DietaryPref` ADD CONSTRAINT `DietaryPref_authorID_fkey` FOREIGN KEY (`authorID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_authorID_fkey` FOREIGN KEY (`authorID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecipeIngredients` ADD CONSTRAINT `RecipeIngredients_recipeID_fkey` FOREIGN KEY (`recipeID`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecipeInstructions` ADD CONSTRAINT `RecipeInstructions_recipeID_fkey` FOREIGN KEY (`recipeID`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPosts` ADD CONSTRAINT `UserPosts_author_fkey` FOREIGN KEY (`author`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPosts` ADD CONSTRAINT `UserPosts_postID_fkey` FOREIGN KEY (`postID`) REFERENCES `Posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostTags` ADD CONSTRAINT `PostTags_postID_fkey` FOREIGN KEY (`postID`) REFERENCES `Posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecipeToRecipeTags` ADD CONSTRAINT `_RecipeToRecipeTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `Recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecipeToRecipeTags` ADD CONSTRAINT `_RecipeToRecipeTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `RecipeTags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
