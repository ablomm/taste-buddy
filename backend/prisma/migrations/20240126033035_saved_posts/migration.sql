-- CreateTable
CREATE TABLE `UserSavedPosts` (
    `userID` INTEGER NOT NULL,
    `postID` INTEGER NOT NULL,
    `timeSaved` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userID`, `postID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserSavedPosts` ADD CONSTRAINT `UserSavedPosts_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSavedPosts` ADD CONSTRAINT `UserSavedPosts_postID_fkey` FOREIGN KEY (`postID`) REFERENCES `Posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
