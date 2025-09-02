const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://nhmgolhyebehkmvlutir.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key-here';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Database connection string for direct PostgreSQL access
const dbConnectionString = 'postgresql://postgres:aass1122@db.nhmgolhyebehkmvlutir.supabase.co:5432/postgres';

module.exports = {
  supabase,
  supabaseUrl,
  supabaseKey,
  dbConnectionString
};
