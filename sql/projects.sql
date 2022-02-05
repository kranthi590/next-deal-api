/* Make fields nullable */
ALTER TABLE projects MODIFY `expected_end_date` datetime NULL;
ALTER TABLE projects MODIFY `currency` varchar(50) NULL;

/* Add new fields*/
ALTER TABLE projects ADD COLUMN is_deleted BOOLEAN DEFAULT false;