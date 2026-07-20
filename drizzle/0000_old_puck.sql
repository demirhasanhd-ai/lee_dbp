CREATE TABLE `approval_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`course_version_id` text NOT NULL,
	`requested_by` text NOT NULL,
	`reviewed_by` text,
	`decision` text DEFAULT 'pending' NOT NULL,
	`note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`reviewed_at` text,
	FOREIGN KEY (`course_version_id`) REFERENCES `course_versions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`details` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `course_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`academic_year` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`ects` integer,
	`purpose_tr` text,
	`purpose_en` text,
	`content_tr` text,
	`content_en` text,
	`published_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `course_versions_unique_idx` ON `course_versions` (`course_id`,`academic_year`,`version`);--> statement-breakpoint
CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`external_id` text,
	`program_id` text NOT NULL,
	`code` text NOT NULL,
	`name_tr` text NOT NULL,
	`name_en` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courses_external_id_idx` ON `courses` (`external_id`);--> statement-breakpoint
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`course_version_id` text,
	`object_key` text NOT NULL,
	`visibility` text NOT NULL,
	`content_type` text NOT NULL,
	`original_name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`course_version_id`) REFERENCES `course_versions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `files_object_key_unique` ON `files` (`object_key`);--> statement-breakpoint
CREATE TABLE `learning_outcomes` (
	`id` text PRIMARY KEY NOT NULL,
	`course_version_id` text NOT NULL,
	`display_order` integer NOT NULL,
	`description_tr` text NOT NULL,
	`description_en` text,
	FOREIGN KEY (`course_version_id`) REFERENCES `course_versions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` text PRIMARY KEY NOT NULL,
	`external_id` text,
	`name_tr` text NOT NULL,
	`name_en` text,
	`level` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `programs_external_id_idx` ON `programs` (`external_id`);