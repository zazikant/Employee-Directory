-- Migration: Create search indexes
-- Description: Create GIN indexes for fast full-text and fuzzy search

-- Create GIN index for full-text search (fastest for FTS queries)
CREATE INDEX IF NOT EXISTS idx_employees_search_vector_gin 
ON employees USING GIN (search_vector);

-- Create GIN index for pg_trgm fuzzy matching on name field
CREATE INDEX IF NOT EXISTS idx_employees_name_trgm_gin 
ON employees USING GIN (name gin_trgm_ops);

-- Create GIN index for fuzzy matching on department field
CREATE INDEX IF NOT EXISTS idx_employees_dept_trgm_gin 
ON employees USING GIN (department gin_trgm_ops);

-- Verify indexes were created
SELECT 
  schemaname, 
  tablename, 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE tablename = 'employees'
AND indexname LIKE 'idx_employees%'
ORDER BY indexname;
