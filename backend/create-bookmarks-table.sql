-- Create user_bookmarks table
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    bookmarked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, content_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_content ON user_bookmarks(content_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_date ON user_bookmarks(bookmarked_at DESC);

-- Add comment to table
COMMENT ON TABLE user_bookmarks IS 'User bookmarks for content items';
COMMENT ON COLUMN user_bookmarks.id IS 'Unique bookmark identifier';
COMMENT ON COLUMN user_bookmarks.user_id IS 'User who bookmarked the content';
COMMENT ON COLUMN user_bookmarks.content_id IS 'Content that was bookmarked';
COMMENT ON COLUMN user_bookmarks.bookmarked_at IS 'When the content was bookmarked';
COMMENT ON COLUMN user_bookmarks.created_at IS 'When the bookmark record was created';
