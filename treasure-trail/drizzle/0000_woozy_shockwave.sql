CREATE TABLE `campaign_profiles` (
	`profile_id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`schema_version` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
