import { getSupabaseClient } from './supabaseClient.js';

export async function getCurrentSession() {
  const client = getSupabaseClient();
  if (!client) return null;

  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(callback) {
  const client = getSupabaseClient();
  if (!client) return () => {};

  const { data } = client.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data?.subscription?.unsubscribe?.();
}

export async function signInWithEmail(email) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Đăng nhập cần Supabase mode.');

  const { data, error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const client = getSupabaseClient();
  if (!client) return;

  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function loadProfile(userId) {
  const client = getSupabaseClient();
  if (!client || !userId) return null;

  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
