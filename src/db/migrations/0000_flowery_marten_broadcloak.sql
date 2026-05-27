CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`icon_name` text,
	`color_hex` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`archived_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_idx` ON `categories` (`name`);--> statement-breakpoint
CREATE TABLE `goods` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`default_category_id` integer,
	`default_unit` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`archived_at` integer,
	FOREIGN KEY (`default_category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `goods_name_idx` ON `goods` (`name`);--> statement-breakpoint
CREATE INDEX `goods_category_idx` ON `goods` (`default_category_id`);--> statement-breakpoint
CREATE TABLE `stores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`currency_code_override` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`archived_at` integer
);
--> statement-breakpoint
CREATE INDEX `stores_name_idx` ON `stores` (`name`);--> statement-breakpoint
CREATE TABLE `trips` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`store_id` integer NOT NULL,
	`resolved_currency_code` text NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`notes` text,
	`planned_for` integer,
	`started_at` integer,
	`completed_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`archived_at` integer,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `trips_store_idx` ON `trips` (`store_id`);--> statement-breakpoint
CREATE INDEX `trips_status_idx` ON `trips` (`status`);--> statement-breakpoint
CREATE INDEX `trips_completed_at_idx` ON `trips` (`completed_at`);--> statement-breakpoint
CREATE TABLE `trip_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trip_id` integer NOT NULL,
	`good_id` integer NOT NULL,
	`category_id_snapshot` integer,
	`unit_snapshot` integer,
	`planned_quantity` real DEFAULT 0,
	`actual_quantity` real DEFAULT 0,
	`planned_unit_price` real DEFAULT 0,
	`actual_unit_price` real DEFAULT 0,
	`is_checked` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`archived_at` integer,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`good_id`) REFERENCES `goods`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `trip_items_trip_sort_idx` ON `trip_items` (`trip_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX `trip_items_good_idx` ON `trip_items` (`good_id`);--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`global_currency_code` text DEFAULT 'PHP' NOT NULL,
	`theme_mode` text DEFAULT 'system' NOT NULL,
	`seed_color_hex` text DEFAULT '#2E5C8A' NOT NULL,
	`schema_version` integer DEFAULT 1 NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
