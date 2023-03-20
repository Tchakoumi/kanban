-- CreateTable
CREATE TABLE `Board` (
    `board_id` VARCHAR(36) NOT NULL,
    `board_name` VARCHAR(45) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`board_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BoardAudit` (
    `board_audit_id` VARCHAR(36) NOT NULL,
    `board_name` VARCHAR(45) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `board_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`board_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Column` (
    `column_id` VARCHAR(36) NOT NULL,
    `column_title` VARCHAR(45) NOT NULL,
    `column_color_code` VARCHAR(10) NOT NULL,
    `column_position` INTEGER NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `board_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`column_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ColumnAudit` (
    `column_audit_id` VARCHAR(36) NOT NULL,
    `column_position` INTEGER NOT NULL,
    `column_title` VARCHAR(45) NOT NULL,
    `column_color_code` VARCHAR(10) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `column_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`column_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `task_id` VARCHAR(36) NOT NULL,
    `task_position` INTEGER NOT NULL,
    `task_title` VARCHAR(45) NOT NULL,
    `task_description` TINYTEXT NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `column_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaskAudit` (
    `task_audit_id` VARCHAR(36) NOT NULL,
    `task_position` INTEGER NOT NULL,
    `task_title` VARCHAR(45) NOT NULL,
    `task_description` TINYTEXT NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `task_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`task_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subtask` (
    `subtask_id` VARCHAR(36) NOT NULL,
    `subtask_title` VARCHAR(36) NOT NULL,
    `is_done` BOOLEAN NOT NULL DEFAULT false,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `task_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`subtask_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubtaskAudit` (
    `subtask_audit_id` VARCHAR(36) NOT NULL,
    `subtask_title` VARCHAR(36) NOT NULL,
    `is_done` BOOLEAN NOT NULL DEFAULT false,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `subtask_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`subtask_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BoardAudit` ADD CONSTRAINT `BoardAudit_board_id_fkey` FOREIGN KEY (`board_id`) REFERENCES `Board`(`board_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Column` ADD CONSTRAINT `Column_board_id_fkey` FOREIGN KEY (`board_id`) REFERENCES `Board`(`board_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ColumnAudit` ADD CONSTRAINT `ColumnAudit_column_id_fkey` FOREIGN KEY (`column_id`) REFERENCES `Column`(`column_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_column_id_fkey` FOREIGN KEY (`column_id`) REFERENCES `Column`(`column_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskAudit` ADD CONSTRAINT `TaskAudit_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subtask` ADD CONSTRAINT `Subtask_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubtaskAudit` ADD CONSTRAINT `SubtaskAudit_subtask_id_fkey` FOREIGN KEY (`subtask_id`) REFERENCES `Subtask`(`subtask_id`) ON DELETE CASCADE ON UPDATE CASCADE;
