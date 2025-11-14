-- Migration: Add full-text search vector column
-- Description: Add generated tsvector column for efficient full-text search

-- Add search_vector column (automatically updated when name or department changes)
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS search_vector tsvector 
GENERATED ALWAYS AS (
  to_tsvector('english', 
    coalesce(name, '') || ' ' || 
    coalesce(department, '')
  )
) STORED;

-- Verify column was created
SELECT column_name, data_type, is_generated 
FROM information_schema.columns 
WHERE table_name = 'employees' 
AND column_name = 'search_vector';
