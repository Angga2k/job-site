-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NULL,
    `phone_number` VARCHAR(191) NULL,
    `user_type` ENUM('job_seeker', 'employer') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `company_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`company_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Job` (
    `job_id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL,
    `job_title` VARCHAR(191) NOT NULL,
    `job_description` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `job_type` ENUM('full_time', 'part_time', 'contract', 'internship', 'temporary') NOT NULL,
    `salary_range` VARCHAR(191) NULL,
    `posted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `closing_date` DATETIME(3) NULL,

    PRIMARY KEY (`job_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobApplication` (
    `application_id` INTEGER NOT NULL AUTO_INCREMENT,
    `job_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `cover_letter` VARCHAR(191) NULL,
    `resume` VARCHAR(191) NOT NULL,
    `applied_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`application_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobCategory` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `JobCategory_category_name_key`(`category_name`),
    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Job_Category` (
    `job_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,

    PRIMARY KEY (`job_id`, `category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SavedJob` (
    `saved_job_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `job_id` INTEGER NOT NULL,
    `saved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`saved_job_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanyReview` (
    `review_id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `review` VARCHAR(191) NULL,
    `reviewed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`company_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobApplication` ADD CONSTRAINT `JobApplication_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `Job`(`job_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobApplication` ADD CONSTRAINT `JobApplication_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job_Category` ADD CONSTRAINT `Job_Category_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `Job`(`job_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job_Category` ADD CONSTRAINT `Job_Category_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `JobCategory`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedJob` ADD CONSTRAINT `SavedJob_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedJob` ADD CONSTRAINT `SavedJob_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `Job`(`job_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyReview` ADD CONSTRAINT `CompanyReview_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`company_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyReview` ADD CONSTRAINT `CompanyReview_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
