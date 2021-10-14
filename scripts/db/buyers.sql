DROP TABLE IF EXISTS buyers;

CREATE TABLE IF NOT EXISTS `buyers` (
    `id` INTEGER NOT NULL auto_increment ,
    `rut` VARCHAR(255) NOT NULL UNIQUE,
    `legal_name` VARCHAR(255) NOT NULL,
    `fantasy_name` VARCHAR(255) NOT NULL,
    `web_site_url` VARCHAR(255),
    `email_id` CHAR(36) BINARY NOT NULL,
    `subdomain_name` VARCHAR(50) NOT NULL UNIQUE,
    `status` VARCHAR(10) NOT NULL,
    `licensed_until` DATE NOT NULL,
    `additional_data` VARCHAR(255),
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `contact_info_id` INTEGER NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (contact_info_id) REFERENCES business_addresses(id)
) ENGINE=InnoDB;