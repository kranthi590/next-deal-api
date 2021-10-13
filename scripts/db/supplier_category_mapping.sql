CREATE TABLE IF NOT EXISTS `supplier_category_mapping` (
        `id` INTEGER NOT NULL auto_increment PRIMARY KEY,
        `supplier_id` INTEGER NOT NULL,
        `category_id` INTEGER NOT NULL,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
        FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;