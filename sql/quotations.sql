UPDATE `quotation_requests` SET `comments` = `description`;
ALTER TABLE quotation_requests DROP COLUMN description;

ALTER TABLE quotation_requests MODIFY `currency` varchar(50) NOT NULL;
ALTER TABLE quotation_requests MODIFY `comments` TEXT NOT NULL;
ALTER TABLE quotation_requests MODIFY `additional_data` TEXT default '';
ALTER TABLE quotation_requests MODIFY `estimated_budget` int(11) NOT NULL