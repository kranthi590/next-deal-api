ALTER TABLE projects MODIFY `currency` varchar(50) NOT NULL;
ALTER TABLE projects ADD description TEXT NOT NULL;
ALTER TABLE projects MODIFY `is_deleted` tinyint(1) DEFAULT 0 NOT NULL;
ALTER TABLE projects MODIFY description TEXT DEFAULT NULL;
ALTER TABLE projects MODIFY `estimated_budget` int(11) DEFAULT NULL;
SET FOREIGN_KEY_CHECKS=0;
ALTER TABLE projects DROP INDEX `projects_buyer_id_code`;
SET FOREIGN_KEY_CHECKS=1;