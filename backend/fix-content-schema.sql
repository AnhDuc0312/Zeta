-- Fix Content Table Schema
-- Add missing fields and improve performance

-- Add missing columns if they don't exist
ALTER TABLE content 
ADD COLUMN IF NOT EXISTS read_time VARCHAR(50) DEFAULT '5 min read',
ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';

-- Add constraint for status
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_content_status'
    ) THEN
        ALTER TABLE content 
        ADD CONSTRAINT check_content_status 
        CHECK (status IN ('draft', 'published', 'archived', 'private'));
    END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_author_id ON content(author_id);
CREATE INDEX IF NOT EXISTS idx_content_category_id ON content(category_id);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_featured ON content(featured);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(created_at);
CREATE INDEX IF NOT EXISTS idx_content_updated_at ON content(updated_at);

-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_content_type_status ON content(type, status);
CREATE INDEX IF NOT EXISTS idx_content_author_status ON content(author_id, status);
CREATE INDEX IF NOT EXISTS idx_content_featured_type ON content(featured, type);

-- Update existing content to have proper status
UPDATE content SET status = 'published' WHERE status IS NULL;

-- Calculate word count for existing content
UPDATE content 
SET word_count = (
    LENGTH(COALESCE(title, '')) + 
    LENGTH(COALESCE(description, '')) + 
    LENGTH(COALESCE(content, ''))
) / 5  -- Approximate words per character
WHERE word_count = 0;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_content_updated_at ON content;
CREATE TRIGGER update_content_updated_at
    BEFORE UPDATE ON content
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();
