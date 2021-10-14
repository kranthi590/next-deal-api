CREATE TABLE IF NOT EXISTS `roles` (
        `id` INTEGER NOT NULL auto_increment PRIMARY KEY,
        `name` VARCHAR(255) UNIQUE,
        `description` VARCHAR(255),
        `api_path` VARCHAR(255) UNIQUE
) ENGINE=InnoDB;

INSERT INTO roles(name, description, api_path) VALUES('admin', 'Admin', '*');