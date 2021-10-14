CREATE TABLE IF NOT EXISTS `supplier_service_locations_mappings` (
        `id` INTEGER NOT NULL auto_increment PRIMARY KEY,
        `supplier_id` INTEGER NOT NULL,
        `region_id` INTEGER NOT NULL,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
        FOREIGN KEY (region_id) REFERENCES regions(id)
) ENGINE=InnoDB;