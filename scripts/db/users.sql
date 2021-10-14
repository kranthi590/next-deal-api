DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS `users` (
    `id` INTEGER NOT NULL auto_increment ,
    `contact_info_id` INTEGER NOT NULL,
    `buyer_id` INTEGER,
    `supplier_id` INTEGER,
    `role_id` INTEGER NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email_id` CHAR(36) BINARY NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `additional_data` VARCHAR(255),
    `last_login_date` TIMESTAMP NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (contact_info_id) REFERENCES business_addresses(id),
    FOREIGN KEY (buyer_id) REFERENCES buyers(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
) ENGINE=InnoDB;