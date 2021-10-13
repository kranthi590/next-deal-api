DROP TABLE IF EXISTS suppliers;

CREATE TABLE IF NOT EXISTS `suppliers` (
    `id` INTEGER NOT NULL auto_increment ,
    `rut` VARCHAR(255) NOT NULL UNIQUE,
    `legal_name` VARCHAR(255) NOT NULL,
    `fantasy_name` VARCHAR(255) NOT NULL,
    `web_site_url` VARCHAR(255),
    `logo_url` VARCHAR(255) NOT NULL,
    `is_shared` TINYINT(1) NOT NULL DEFAULT true,
    `type` VARCHAR(255) NOT NULL,
    `email_id` CHAR(36) BINARY NOT NULL,
    `in_charge_fullname` VARCHAR(255),
    `in_charge_role` VARCHAR(255),
    `created_by` INTEGER,
    `additional_data` VARCHAR(255),
    `business_address_id` INTEGER NOT NULL,
    `in_charge_address_id` INTEGER,
    `billing_address_id` INTEGER,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (`id`),
    FOREIGN KEY (business_address_id) REFERENCES business_addresses(id),
    FOREIGN KEY (in_charge_address_id) REFERENCES addresses(id),
    FOREIGN KEY (billing_address_id) REFERENCES addresses(id)
) ENGINE=InnoDB;