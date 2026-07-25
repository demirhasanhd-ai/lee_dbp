CREATE TABLE `role_module_access` (
	`role` text NOT NULL,
	`module` text NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_by` text,
	PRIMARY KEY(`role`, `module`)
);
