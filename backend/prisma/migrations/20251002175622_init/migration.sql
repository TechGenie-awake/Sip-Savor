-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(255) NULL,
    `avatar_url` TEXT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipes` (
    `id` INTEGER NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `image_url` TEXT NULL,
    `summary` TEXT NULL,
    `instructions` TEXT NULL,
    `prep_time` INTEGER NULL,
    `cook_time` INTEGER NULL,
    `servings` INTEGER NULL,
    `cuisine_type` VARCHAR(100) NULL,
    `diet_type` VARCHAR(100) NULL,
    `nutrition_data` JSON NULL,
    `ingredients` JSON NULL,
    `source_url` TEXT NULL,
    `cached_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `recipes_cuisine_type_idx`(`cuisine_type`),
    INDEX `recipes_diet_type_idx`(`diet_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cocktails` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NULL,
    `alcoholic` VARCHAR(50) NULL,
    `glass_type` VARCHAR(100) NULL,
    `instructions` TEXT NULL,
    `image_url` TEXT NULL,
    `ingredients` JSON NULL,
    `cached_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `cocktails_category_idx`(`category`),
    INDEX `cocktails_alcoholic_idx`(`alcoholic`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_favorites` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `item_type` VARCHAR(20) NOT NULL,
    `item_id` INTEGER NOT NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_favorites_user_id_idx`(`user_id`),
    INDEX `user_favorites_item_type_item_id_idx`(`item_type`, `item_id`),
    UNIQUE INDEX `user_favorites_user_id_item_type_item_id_key`(`user_id`, `item_type`, `item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `collections` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `collections_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `collection_items` (
    `id` VARCHAR(191) NOT NULL,
    `collection_id` VARCHAR(191) NOT NULL,
    `item_type` VARCHAR(20) NOT NULL,
    `item_id` INTEGER NOT NULL,
    `added_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `collection_items_collection_id_idx`(`collection_id`),
    UNIQUE INDEX `collection_items_collection_id_item_type_item_id_key`(`collection_id`, `item_type`, `item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `search_history` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `search_query` VARCHAR(255) NOT NULL,
    `search_type` VARCHAR(20) NOT NULL,
    `searched_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `search_history_user_id_searched_at_idx`(`user_id`, `searched_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_ratings` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `item_type` VARCHAR(20) NOT NULL,
    `item_id` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `review` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `user_ratings_item_type_item_id_idx`(`item_type`, `item_id`),
    UNIQUE INDEX `user_ratings_user_id_item_type_item_id_key`(`user_id`, `item_type`, `item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_favorites` ADD CONSTRAINT `user_favorites_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `collections` ADD CONSTRAINT `collections_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `collection_items` ADD CONSTRAINT `collection_items_collection_id_fkey` FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `search_history` ADD CONSTRAINT `search_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_ratings` ADD CONSTRAINT `user_ratings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
