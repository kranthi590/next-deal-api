/* Add new fields*/
ALTER TABLE quotation_requests ADD COLUMN is_deleted BOOLEAN DEFAULT false;

ALTER TABLE quotation_responses ADD COLUMN is_deleted BOOLEAN DEFAULT false;
