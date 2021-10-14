CREATE TABLE IF NOT EXISTS `users_roles_mappings` (
        `id` INTEGER NOT NULL auto_increment PRIMARY KEY,
        `role_id` INTEGER NOT NULL,
        `user_id` INTEGER NOT NULL,
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;