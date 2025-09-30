-- Schema Zeta CMS Database
-- Xuất lúc: 2025-09-29T03:46:03.391Z

-- ENUM TYPES
CREATE TYPE comment_status AS ENUM ('visible', 'hidden', 'deleted');
CREATE TYPE content_status AS ENUM ('published', 'draft', 'private', 'archived');
CREATE TYPE content_type AS ENUM ('article', 'document', 'note');
CREATE TYPE log_status AS ENUM ('success', 'warning', 'error', 'info');
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'banned');

-- TABLE: activity_logs
CREATE TABLE activity_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    timestamp timestamp with time zone DEFAULT now(),
    user_id uuid,
    action character varying(100) NOT NULL,
    resource character varying(255),
    ip character varying(45),
    user_agent character varying(255),
    status USER-DEFINED NOT NULL,
    details text
);

-- TABLE: analytics_events
CREATE TABLE analytics_events (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    event_type character varying(100) NOT NULL,
    user_id uuid,
    content_id uuid,
    timestamp timestamp with time zone DEFAULT now(),
    meta jsonb
);

-- TABLE: categories
CREATE TABLE categories (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(100) NOT NULL,
    description text
);

-- TABLE: comments
CREATE TABLE comments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    content_id uuid,
    user_id uuid,
    text text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    status USER-DEFINED NOT NULL DEFAULT 'visible'::comment_status
);

-- TABLE: content
CREATE TABLE content (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    type USER-DEFINED NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    content text,
    file_url character varying(255),
    file_size character varying(50),
    status USER-DEFINED NOT NULL DEFAULT 'draft'::content_status,
    author_id uuid,
    author_email character varying(255),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    published_at timestamp with time zone,
    views integer DEFAULT 0,
    likes integer DEFAULT 0,
    comments integer DEFAULT 0,
    category_id uuid,
    featured boolean DEFAULT false,
    word_count integer,
    seo_title character varying(255),
    seo_description character varying(255),
    custom_url character varying(255),
    allow_comments boolean DEFAULT true,
    tags jsonb
);

-- TABLE: content_tags
CREATE TABLE content_tags (
    content_id uuid NOT NULL,
    tag_id uuid NOT NULL
);

-- TABLE: settings
CREATE TABLE settings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    key character varying(100) NOT NULL,
    value text
);

-- TABLE: tags
CREATE TABLE tags (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(50) NOT NULL
);

-- TABLE: user_likes
CREATE TABLE user_likes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    content_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- TABLE: user_views
CREATE TABLE user_views (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    content_id uuid,
    viewed_at timestamp with time zone DEFAULT now()
);

-- TABLE: users
CREATE TABLE users (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role USER-DEFINED NOT NULL DEFAULT 'user'::user_role,
    status USER-DEFINED NOT NULL DEFAULT 'active'::user_status,
    avatar character varying(255),
    bio text,
    location character varying(255),
    website character varying(255),
    join_date timestamp with time zone DEFAULT now(),
    last_active timestamp with time zone
);

-- CONSTRAINTS
ALTER TABLE activity_logs ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE activity_logs ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);
ALTER TABLE analytics_events ADD CONSTRAINT analytics_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE analytics_events ADD CONSTRAINT analytics_events_content_id_fkey FOREIGN KEY (content_id) REFERENCES content(id);
ALTER TABLE analytics_events ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);
ALTER TABLE categories ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
ALTER TABLE categories ADD CONSTRAINT categories_name_key UNIQUE (name);
ALTER TABLE comments ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE comments ADD CONSTRAINT comments_content_id_fkey FOREIGN KEY (content_id) REFERENCES content(id);
ALTER TABLE comments ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
ALTER TABLE content ADD CONSTRAINT content_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id);
ALTER TABLE content ADD CONSTRAINT content_author_id_fkey FOREIGN KEY (author_id) REFERENCES users(id);
ALTER TABLE content ADD CONSTRAINT content_pkey PRIMARY KEY (id);
ALTER TABLE content_tags ADD CONSTRAINT content_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags(id);
ALTER TABLE content_tags ADD CONSTRAINT content_tags_content_id_fkey FOREIGN KEY (content_id) REFERENCES content(id);
ALTER TABLE content_tags ADD CONSTRAINT content_tags_pkey PRIMARY KEY (content_id);
ALTER TABLE content_tags ADD CONSTRAINT content_tags_pkey PRIMARY KEY (content_id);
ALTER TABLE content_tags ADD CONSTRAINT content_tags_pkey PRIMARY KEY (tag_id);
ALTER TABLE content_tags ADD CONSTRAINT content_tags_pkey PRIMARY KEY (tag_id);
ALTER TABLE settings ADD CONSTRAINT settings_pkey PRIMARY KEY (id);
ALTER TABLE settings ADD CONSTRAINT settings_key_key UNIQUE (key);
ALTER TABLE tags ADD CONSTRAINT tags_pkey PRIMARY KEY (id);
ALTER TABLE tags ADD CONSTRAINT tags_name_key UNIQUE (name);
ALTER TABLE user_likes ADD CONSTRAINT user_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE user_likes ADD CONSTRAINT user_likes_content_id_fkey FOREIGN KEY (content_id) REFERENCES content(id);
ALTER TABLE user_likes ADD CONSTRAINT user_likes_pkey PRIMARY KEY (id);
ALTER TABLE user_likes ADD CONSTRAINT user_likes_user_id_content_id_key UNIQUE (content_id);
ALTER TABLE user_likes ADD CONSTRAINT user_likes_user_id_content_id_key UNIQUE (content_id);
ALTER TABLE user_likes ADD CONSTRAINT user_likes_user_id_content_id_key UNIQUE (user_id);
ALTER TABLE user_likes ADD CONSTRAINT user_likes_user_id_content_id_key UNIQUE (user_id);
ALTER TABLE user_views ADD CONSTRAINT user_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE user_views ADD CONSTRAINT user_views_content_id_fkey FOREIGN KEY (content_id) REFERENCES content(id);
ALTER TABLE user_views ADD CONSTRAINT user_views_pkey PRIMARY KEY (id);
ALTER TABLE user_views ADD CONSTRAINT user_views_user_id_content_id_key UNIQUE (user_id);
ALTER TABLE user_views ADD CONSTRAINT user_views_user_id_content_id_key UNIQUE (content_id);
ALTER TABLE user_views ADD CONSTRAINT user_views_user_id_content_id_key UNIQUE (content_id);
ALTER TABLE user_views ADD CONSTRAINT user_views_user_id_content_id_key UNIQUE (user_id);
ALTER TABLE users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
