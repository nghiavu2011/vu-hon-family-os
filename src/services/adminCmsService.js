
import { isSupabaseMode } from '../runtimeConfig.js';
import { getSupabaseClient } from './supabaseClient.js';
import { exportPatch, toPersonInsertPayload } from '../lib/adminPatch.js';

function requireSupabaseClient() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Chức năng này cần Supabase mode.');
  return client;
}

export async function savePersonDraft(form, actor) {
  const payload = toPersonInsertPayload(form);

  if (!isSupabaseMode()) {
    return exportPatch('person-draft', payload, actor);
  }

  const client = requireSupabaseClient();
  const { data, error } = await client.from('people').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function saveRelationshipDraft(form, actor) {
  const payload = {
    person_id: form.personId,
    related_person_id: form.relatedPersonId,
    relation_type: form.relationType || 'unknown',
    note: form.note || null,
    confidence: form.confidence || 'medium',
  };

  if (!isSupabaseMode()) {
    return exportPatch('relationship-draft', payload, actor);
  }

  const client = requireSupabaseClient();
  const { data, error } = await client.from('relationships').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function saveEventDraft(form, actor) {
  const payload = {
    person_id: form.personId || null,
    title: form.title,
    event_type: form.eventType || 'death_anniversary',
    date_lunar: form.dateLunar || null,
    date_solar: form.dateSolar || null,
    branch: form.branch || null,
    privacy: form.privacy || 'family',
    note: form.note || null,
  };

  if (!isSupabaseMode()) {
    return exportPatch('event-draft', payload, actor);
  }

  const client = requireSupabaseClient();
  const { data, error } = await client.from('family_events').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function saveGraveDraft(form, actor) {
  const payload = {
    person_id: form.personId || null,
    name: form.name,
    cemetery_name: form.cemeteryName || null,
    grave_area: form.graveArea || null,
    grave_row: form.graveRow || null,
    grave_number: form.graveNumber || null,
    latitude: form.lat ? Number(form.lat) : null,
    longitude: form.lng ? Number(form.lng) : null,
    google_maps_url: form.googleMapsUrl || null,
    route_note: form.routeNote || null,
    epitaph_text: form.epitaphText || null,
    privacy: form.privacy || 'family',
    status: 'needs_review',
  };

  if (!isSupabaseMode()) {
    return exportPatch('grave-draft', payload, actor);
  }

  const client = requireSupabaseClient();
  const { data, error } = await client.from('grave_sites').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function submitFamilyRequest(form, actor) {
  const payload = {
    request_type: form.requestType || 'data_correction',
    from_person_id: form.fromPersonId || null,
    to_person_id: form.toPersonId || null,
    message: form.message,
    status: 'pending',
  };

  if (!isSupabaseMode()) {
    return exportPatch('family-request', payload, actor);
  }

  const client = requireSupabaseClient();
  const { data, error } = await client.from('family_requests').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function approveRequest(requestId, actor) {
  if (!isSupabaseMode()) {
    return exportPatch('approve-request', { requestId, status: 'approved' }, actor);
  }

  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('family_requests')
    .update({ status: 'approved', reviewed_at: new Date().toISOString() })
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
