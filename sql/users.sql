ALTER TABLE users DROP FOREIGN KEY `users_ibfk_1`;
ALTER TABLE users DROP COLUMN contact_info_id;
ALTER TABLE users ADD created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

Update users, projects
set users.created_at = projects.created_at
WHERE (users.buyer_id = projects.buyer_id);
