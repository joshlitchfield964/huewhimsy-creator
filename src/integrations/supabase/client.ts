
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tbitpieidplhnshxbstx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiaXRwaWVpZHBsaG5zaHhic3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NzE1MDcsImV4cCI6MjA1NTM0NzUwN30.cE_dsjL9Xy0Fkd04goo7nUw9D9t3BLgrQzZbzZo8ThQ";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
