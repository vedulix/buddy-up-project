// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gfrrgnfpolyzuvqgcvei.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcnJnbmZwb2x5enV2cWdjdmVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MDczMzcsImV4cCI6MjA2NTQ4MzMzN30.hgIHOwq6dfyyHNOYrDaj4Tm-dmqd4MX7hzPLhzX-nMU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);