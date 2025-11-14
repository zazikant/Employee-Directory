-- Migration: Enable search extensions
-- Description: Enable pg_trgm extension for fuzzy matching

-- Enable pg_trgm extension for trigram similarity matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Verify extension was enabled
SELECT extname, extversion 
FROM pg_extension 
WHERE extname = 'pg_trgm';
