import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vftfsutowcqzxnlyyffr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmdGZzdXRvd2NxenhubHl5ZmZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODM5MzgsImV4cCI6MjA3OTU1OTkzOH0.JAGKHYTbSXFsbut9Bb_V2-8pzDRS8M52w3Lm9X4sLnk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);