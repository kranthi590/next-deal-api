ALTER TABLE suppliers ADD created_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE suppliers ADD updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE suppliers ADD comments TEXT NOT NULL;
ALTER TABLE suppliers MODIFY `logo_url` varchar(255) DEFAULT NULL,;
