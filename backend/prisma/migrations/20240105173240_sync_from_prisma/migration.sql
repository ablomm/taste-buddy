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

-- AddForeignKey
ALTER TABLE `UserPosts` ADD CONSTRAINT `UserPosts_author_fkey` FOREIGN KEY (`author`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPosts` ADD CONSTRAINT `UserPosts_postID_fkey` FOREIGN KEY (`postID`) REFERENCES `Posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostTags` ADD CONSTRAINT `PostTags_postID_fkey` FOREIGN KEY (`postID`) REFERENCES `Posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
