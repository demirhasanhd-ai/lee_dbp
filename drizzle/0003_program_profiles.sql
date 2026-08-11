CREATE TABLE `program_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`program_name` text NOT NULL,
	`level` text NOT NULL,
	`degree` text DEFAULT '' NOT NULL,
	`manager` text DEFAULT '' NOT NULL,
	`language` text DEFAULT 'Türkçe' NOT NULL,
	`qualification_rules` text DEFAULT '' NOT NULL,
	`sections_json` text DEFAULT '[]' NOT NULL,
	`outcomes_json` text DEFAULT '[]' NOT NULL,
	`tyyc_rows_json` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `program_profiles_program_level_idx` ON `program_profiles` (`program_name`,`level`);