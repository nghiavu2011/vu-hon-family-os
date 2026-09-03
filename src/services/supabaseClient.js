import { createClient } from '@supabase/supabase-js';
import { runtimeConfig, isSupabaseMode } from '../runtimeConfig.js';

let cachedClient = null;

export function getSupabaseClient() {
  if (!isSupabaseMode()) return null;

  if (!cachedClient) {
    cachedClient = createClient(runtimeConfig.supabaseUrl, runtimeConfig.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return cachedClient;
}
