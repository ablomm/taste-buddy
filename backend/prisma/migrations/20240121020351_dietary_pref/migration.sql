-- CreateTable
CREATE TABLE `DietaryPref` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `authorID` INTEGER NOT NULL,
    `dietaryPref` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DietaryPref` ADD CONSTRAINT `DietaryPref_authorID_fkey` FOREIGN KEY (`authorID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
