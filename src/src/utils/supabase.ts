import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://maqvnokqutuedmijohqe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcXZub2txdXR1ZWRtaWpvaHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMTc3NDEsImV4cCI6MjA3Nzg5Mzc0MX0.Kf0jdhhVzYCWKO8ULi8nLa7B41OajBY64-BZ3DKnO6k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)