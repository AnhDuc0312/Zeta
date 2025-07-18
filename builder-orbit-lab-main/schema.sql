-- ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'banned');
CREATE TYPE content_type AS ENUM ('article', 'document', 'note');
CREATE TYPE content_status AS ENUM ('published', 'draft', 'private', 'archived');
CREATE TYPE comment_status AS ENUM ('visible', 'hidden', 'deleted');
CREATE TYPE log_status AS ENUM ('success', 'warning', 'error', 'info');

-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    status user_status NOT NULL DEFAULT 'active',
    avatar VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    join_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_active TIMESTAMP WITH TIME ZONE
);

-- CATEGORIES
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

-- TAGS
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

-- CONTENT
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type content_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    file_url VARCHAR(255),
    file_size VARCHAR(50),
    status content_status NOT NULL DEFAULT 'draft',
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    author_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    published_at TIMESTAMP WITH TIME ZONE,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    featured BOOLEAN DEFAULT FALSE,
    word_count INTEGER,
    seo_title VARCHAR(255),
    seo_description VARCHAR(255),
    custom_url VARCHAR(255),
    allow_comments BOOLEAN DEFAULT TRUE
);

-- CONTENT_TAGS (Many-to-Many)
CREATE TABLE content_tags (
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, tag_id)
);

-- COMMENTS
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status comment_status NOT NULL DEFAULT 'visible'
);

-- ACTIVITY LOGS
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255),
    ip VARCHAR(45),
    user_agent VARCHAR(255),
    status log_status NOT NULL,
    details TEXT
);

-- SETTINGS (key-value, can be expanded as needed)
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT
);

-- ANALYTICS EVENTS (optional, for advanced analytics)
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content_id UUID REFERENCES content(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    meta JSONB
);

-- Indexes for performance
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_category ON content(category_id);
CREATE INDEX idx_content_author ON content(author_id);
CREATE INDEX idx_comments_content ON comments(content_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_logs_user ON activity_logs(user_id);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_content ON analytics_events(content_id); 