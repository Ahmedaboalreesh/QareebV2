// Supabase Client Configuration for Browser
// This file should be included in HTML files before other scripts

// Supabase configuration
const SUPABASE_URL = 'https://nhmgolhyebehkmvlutir.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Replace with your actual anon key

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Make supabase available globally
window.supabase = supabase;

console.log('🔵 Supabase client initialized');
