Update buyers, projects
set
  buyers.created_at = projects.created_at
WHERE (buyers.id = projects.buyer_id);