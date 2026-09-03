
import { downloadJson } from './utils.js';

export function slugifyId(value = '') {
  const normalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return normalized || `person-${Date.now()}`;
}

export function createPatchEnvelope({ type, payload, actor }) {
  return {
    id: `patch-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    payload,
    actor: actor || { role: 'unknown', branch: '' },
    status: 'draft',
    createdAt: new Date().toISOString(),
    note: 'Static mode patch. Import hoặc duyệt trong Admin CMS/Supabase ở bước production.',
  };
}

export function exportPatch(type, payload, actor) {
  const envelope = createPatchEnvelope({ type, payload, actor });
  downloadJson(`${type}-${envelope.id}.json`, envelope);
  return envelope;
}

export function toPersonInsertPayload(form) {
  return {
    id: form.id || slugifyId(form.name),
    full_name: form.name,
    gender: form.gender || 'unknown',
    generation: form.gen ? Number(form.gen) : null,
    branch: form.branch || null,
    father_id: form.fatherId || null,
    mother_id: form.motherId || null,
    birth_date: form.birthDate || null,
    birth_year: form.birthYear ? Number(form.birthYear) : null,
    death_date: form.deathDate || null,
    death_year: form.deathYear ? Number(form.deathYear) : null,
    lunar_death: form.lunarDeath || null,
    place: form.place || null,
    note: form.note || null,
    confidence: form.confidence || 'medium',
    privacy: form.privacy || 'family',
    status: form.status || 'draft',
    source: form.source || 'Admin CMS',
  };
}
