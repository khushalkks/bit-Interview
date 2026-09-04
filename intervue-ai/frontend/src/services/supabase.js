import { createClient } from '@supabase/supabase-js';

const rawUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  '';

const rawKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  '';

// Check if a real, live Supabase project is configured (pgtpdrylvdssinnnlkuz was a non-resolvable dummy domain)
export const isSupabaseConfigured = Boolean(
  rawUrl && 
  rawKey &&
  !rawUrl.includes('placeholder') &&
  !rawUrl.includes('your-project') &&
  !rawUrl.includes('pgtpdrylvdssinnnlkuz') &&
  !rawKey.includes('placeholder')
);

const safeUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co';
const safeKey = isSupabaseConfigured ? rawKey : 'placeholder-anon-key';

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: isSupabaseConfigured,
    autoRefreshToken: isSupabaseConfigured,
    detectSessionInUrl: isSupabaseConfigured,
  },
});
