ALTER TABLE projects MODIFY `currency` varchar(50) NOT NULL;
ALTER TABLE projects ADD description TEXT NOT NULL;
ALTER TABLE projects MODIFY `is_deleted` tinyint(1) DEFAULT 0 NOT NULL;