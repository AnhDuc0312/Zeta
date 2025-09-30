-- Fix Comments Table Schema
-- Add parent_id column for nested comments support

-- Add parent_id column if it doesn't exist
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_content_id ON comments(content_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Add status index for filtering
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

-- Update existing comments to have proper status
UPDATE comments SET status = 'visible' WHERE status IS NULL;

-- Add constraint to ensure status is valid
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_comments_status'
    ) THEN
        ALTER TABLE comments 
        ADD CONSTRAINT check_comments_status 
        CHECK (status IN ('visible', 'hidden', 'deleted'));
    END IF;
END $$;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_comments_updated_at();
