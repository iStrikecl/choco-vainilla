CREATE TABLE `catalogs` (
	`id` text PRIMARY KEY NOT NULL,
	`products` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL
);
