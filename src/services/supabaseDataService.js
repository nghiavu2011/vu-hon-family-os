import { getSupabaseClient } from './supabaseClient.js';
import { mapPersonRow, mapEventRow, mapPlaceRow, mapGraveRow } from './mappers.js';

async function selectTable(client, table, order = 'id') {
  const { data, error } = await client.from(table).select('*').order(order, { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function loadSupabaseFamilyData() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase chua duoc cau hinh.');
  const [peopleRows, eventRows, placeRows, graveRows, aliasRows, relationshipRows] = await Promise.all([
    selectTable(client, 'people', 'generation'),
    selectTable(client, 'family_events', 'date_lunar'),
    selectTable(client, 'places', 'name'),
    selectTable(client, 'grave_sites', 'name'),
    selectTable(client, 'person_aliases', 'alias'),
    selectTable(client, 'relationships', 'relation_type'),
  ]);
  const aliasesByPerson = new Map();
  aliasRows.forEach((row) => { if (!aliasesByPerson.has(row.person_id)) aliasesByPerson.set(row.person_id, []); aliasesByPerson.get(row.person_id).push(row.alias); });
  const spousesByPerson = new Map();
  const childrenByParent = new Map();
  relationshipRows.forEach((row) => {
    if (row.relation_type === 'spouse') { if (!spousesByPerson.has(row.person_id)) spousesByPerson.set(row.person_id, []); spousesByPerson.get(row.person_id).push(row.related_person_id); }
    if (row.relation_type === 'child') { if (!childrenByParent.has(row.person_id)) childrenByParent.set(row.person_id, []); childrenByParent.get(row.person_id).push(row.related_person_id); }
  });
  const people = peopleRows.map((row) => mapPersonRow({ ...row, aliases: aliasesByPerson.get(row.id) || [], spouse_ids: spousesByPerson.get(row.id) || [], children_ids: childrenByParent.get(row.id) || [] }));
  return { people, events: eventRows.map(mapEventRow), places: placeRows.map(mapPlaceRow), graves: graveRows.map(mapGraveRow), source: 'supabase' };
}
