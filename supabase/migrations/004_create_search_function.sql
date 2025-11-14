-- Migration: Create advanced search RPC function
-- Description: Hybrid search function combining FTS + fuzzy matching with relevance scoring

CREATE OR REPLACE FUNCTION search_employees_advanced(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  hobbies TEXT,
  tenure_years NUMERIC,
  tenure_months NUMERIC,
  department TEXT,
  personal_traits TEXT,
  photo_url TEXT,
  match_type TEXT,
  relevance_score REAL
) AS $$
DECLARE
  fts_weight REAL := 1.0;
  fuzzy_weight REAL := 0.6;
BEGIN
  RETURN QUERY
  WITH fts_results AS (
    SELECT 
      e.id,
      e.name,
      e.hobbies,
      e.tenure_years,
      e.tenure_months,
      e.department,
      e.personal_traits,
      e.photo_url,
      'exact'::TEXT as match_type,
      (ts_rank(e.search_vector, websearch_to_tsquery('english', search_term)) * fts_weight) as score
    FROM employees e
    WHERE e.search_vector @@ websearch_to_tsquery('english', search_term)
  ),
  fuzzy_results AS (
    SELECT 
      e.id,
      e.name,
      e.hobbies,
      e.tenure_years,
      e.tenure_months,
      e.department,
      e.personal_traits,
      e.photo_url,
      'fuzzy'::TEXT as match_type,
      (GREATEST(
        similarity(e.name, search_term),
        similarity(e.department, search_term)
      ) * fuzzy_weight) as score
    FROM employees e
    WHERE 
      e.name % search_term
      OR e.department % search_term
  )
  SELECT DISTINCT ON (COALESCE(fts.id, fuzzy.id))
    COALESCE(fts.id, fuzzy.id) as id,
    COALESCE(fts.name, fuzzy.name) as name,
    COALESCE(fts.hobbies, fuzzy.hobbies) as hobbies,
    COALESCE(fts.tenure_years, fuzzy.tenure_years) as tenure_years,
    COALESCE(fts.tenure_months, fuzzy.tenure_months) as tenure_months,
    COALESCE(fts.department, fuzzy.department) as department,
    COALESCE(fts.personal_traits, fuzzy.personal_traits) as personal_traits,
    COALESCE(fts.photo_url, fuzzy.photo_url) as photo_url,
    COALESCE(fts.match_type, fuzzy.match_type) as match_type,
    (COALESCE(fts.score, 0) + COALESCE(fuzzy.score, 0)) as relevance_score
  FROM fts_results fts
  FULL OUTER JOIN fuzzy_results fuzzy ON fts.id = fuzzy.id
  ORDER BY 
    COALESCE(fts.id, fuzzy.id),
    (COALESCE(fts.score, 0) + COALESCE(fuzzy.score, 0)) DESC
  LIMIT 100;
END;
$$ LANGUAGE plpgsql STABLE;

-- Test the function (optional, comment out in production)
-- SELECT * FROM search_employees_advanced('john');
