-- Zeta CMS Database Initialization
-- This file ensures proper initialization order

-- 1. Create database if not exists (PostgreSQL will create it automatically)
-- Database: builder_orbit_lab

-- 2. Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. The schema.sql file will be executed first (01-schema.sql)
-- 4. Then data files will be executed in order (02-users.sql, 03-categories.sql, etc.)

-- This file is just a placeholder to ensure proper initialization
SELECT 'Database initialization started' as status;
