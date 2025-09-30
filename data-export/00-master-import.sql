-- Zeta CMS Database - Master Import File
-- Xuất lúc: 2025-09-29T03:46:03.448Z
-- Hướng dẫn: Chạy file này để import toàn bộ dữ liệu

-- 1. Import Schema
\i schema.sql

-- 2. Import Data (theo thứ tự dependency)
\i users.sql
\i categories.sql
\i tags.sql
\i content.sql
\i content_tags.sql
\i comments.sql
\i activity_logs.sql
\i analytics_events.sql
\i settings.sql
\i user_likes.sql
\i user_views.sql

-- 3. Cập nhật sequences (nếu cần)
-- SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
-- SELECT setval('content_id_seq', (SELECT MAX(id) FROM content));
