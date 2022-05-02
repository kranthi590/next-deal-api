UPDATE `quotation_requests` SET `comments` = `description`;
ALTER TABLE quotation_requests DROP COLUMN description;

ALTER TABLE quotation_requests MODIFY `currency` varchar(50) NOT NULL;
ALTER TABLE quotation_requests MODIFY `comments` TEXT NOT NULL;
ALTER TABLE quotation_requests MODIFY `additional_data` TEXT default '';
ALTER TABLE quotation_requests MODIFY `estimated_budget` int(11) NOT NULL;
ALTER TABLE quotation_requests MODIFY `is_deleted` tinyint(1) DEFAULT 0 NOT NULL;
ALTER TABLE quotation_responses MODIFY `is_deleted` tinyint(1) DEFAULT 0 NOT NULL;
ALTER TABLE quotation_responses MODIFY `comments` TEXT default '';
ALTER TABLE `quotation_request_supplier_mappings` ADD UNIQUE `unique_index`(`supplier_id`, `quotation_request_id`);
ALTER TABLE quotation_responses DROP COLUMN is_deleted;