
import { isSupabaseMode } from '../runtimeConfig.js';
import { getSupabaseClient } from './supabaseClient.js';
import { exportPatch } from '../lib/adminPatch.js';

function requireSupabaseClient() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Chức năng này cần Supabase mode.');
  return client;
}

export async function submitBetaFeedback(form, actor) {
  const payload = {
    feedback_type: form.feedbackType || 'bug',
    screen: form.screen || null,
    severity: form.severity || 'medium',
    title: form.title || null,
    description: form.description,
    reporter_name: form.reporterName || null,
    reporter_contact: form.reporterContact || null,
    status: 'open',
    user_role: actor?.role || 'unknown',
    branch: actor?.branch || null,
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseMode()) {
    return exportPatch('beta-feedback', payload, actor);
  }

  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('beta_feedback')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function submitBetaChecklistSnapshot({ checklistState, metrics }, actor) {
  const payload = {
    checklist_state: checklistState,
    metrics,
    user_role: actor?.role || 'unknown',
    branch: actor?.branch || null,
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseMode()) {
    return exportPatch('beta-checklist-snapshot', payload, actor);
  }

  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('beta_test_runs')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}
