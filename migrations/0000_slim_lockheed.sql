CREATE TABLE `media` (
	`ID` bigint AUTO_INCREMENT NOT NULL,
	`STORAGE_KEY` varchar(255) NOT NULL,
	`ORIGINAL_NAME` varchar(255) NOT NULL,
	`CONTENT_TYPE` varchar(100) NOT NULL,
	`SIZE_BYTES` int NOT NULL,
	`ALT` varchar(255),
	`CATEGORY` varchar(50),
	`CREATED_AT` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `media_ID` PRIMARY KEY(`ID`),
	CONSTRAINT `media_STORAGE_KEY_unique` UNIQUE(`STORAGE_KEY`)
);
--> statement-breakpoint
CREATE INDEX `idx_media_category` ON `media` (`CATEGORY`);