ALTER TABLE suppliers ADD created_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE suppliers ADD updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE suppliers ADD comments TEXT NOT NULL;
ALTER TABLE suppliers MODIFY `logo_url` varchar(255) DEFAULT NULL;
ALTER TABLE suppliers MODIFY `comments` TEXT DEFAULT NULL;
ALTER TABLE suppliers MODIFY `fantasy_name` varchar(255) DEFAULT NULL;
ALTER TABLE suppliers MODIFY `type` varchar(255) DEFAULT NULL;
ALTER TABLE suppliers MODIFY `email_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL;
ALTER TABLE suppliers DROP INDEX `rut`;
ALTER TABLE suppliers ADD UNIQUE `unique_index`(`rut`, `buyer_id`);
ALTER TABLE suppliers MODIFY  `buyer_id` int(11) NULL DEFAULT NULL,
ALTER TABLE suppliers ADD status varchar(20) NOT NULL;
UPDATE suppliers SET status = 'active';
ALTER TABLE suppliers DROP COLUMN `type`;
ALTER TABLE suppliers DROP COLUMN `fantasy_name`;
DROP TABLE supplier_service_locations_mappings;