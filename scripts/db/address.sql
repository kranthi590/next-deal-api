DROP TABLE IF EXISTS business_addresses;
CREATE TABLE IF NOT EXISTS `business_addresses` (
        `id` INTEGER NOT NULL auto_increment PRIMARY KEY,
        `address_line1` VARCHAR(255) NOT NULL,
        `address_line2` VARCHAR(255) NOT NULL,
        `commune_id` int(11) NOT NULL,
        `region_id` int(11) NOT NULL,
        `country_id` int(11) NOT NULL,
        `email_id` VARCHAR(255) NOT NULL,
        `phone_number1` VARCHAR(255) NOT NULL,
        `phone_number2` VARCHAR(255),
        `additional_data` TEXT,
        FOREIGN KEY (country_id) REFERENCES countries(id),
        FOREIGN KEY (region_id) REFERENCES regions(id),
        FOREIGN KEY (commune_id) REFERENCES comunas(id),
        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS addresses;
CREATE TABLE IF NOT EXISTS `addresses` (
        `id` INTEGER NOT NULL auto_increment PRIMARY KEY,
        `address_line1` VARCHAR(255),
        `address_line2` VARCHAR(255),
        `commune_id` int(11),
        `region_id` int(11),
        `country_id` int(11),
        `email_id` VARCHAR(255),
        `phone_number1` VARCHAR(255),
        `phone_number2` TEXT,
        `additional_data` TEXT,
        FOREIGN KEY (country_id) REFERENCES countries(id),
        FOREIGN KEY (region_id) REFERENCES regions(id),
        FOREIGN KEY (commune_id) REFERENCES comunas(id),
        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
