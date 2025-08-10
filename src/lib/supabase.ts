import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Profile {
  id: string;
  role: 'adoptante' | 'publicador' | 'admin';
  name: string;
  city: string;
  avatar_url?: string;
  verified: boolean;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}
