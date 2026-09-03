export function mapPersonRow(row) {
  return {
    id: row.id, name: row.full_name || row.name, gender: row.gender, gen: row.generation,
    branch: row.branch, fatherId: row.father_id, motherId: row.mother_id,
    spouseIds: row.spouse_ids || [], childrenIds: row.children_ids || [], aka: row.aliases || [],
    birthDate: row.birth_date, birthYear: row.birth_year, deathDate: row.death_date, deathYear: row.death_year,
    lunarDeath: row.lunar_death, place: row.place, note: row.note,
    confidence: row.confidence || 'medium', privacy: row.privacy || 'family', source: row.source,
  };
}
export const mapEventRow = (row) => ({ id: row.id, title: row.title, personId: row.person_id, dateLunar: row.date_lunar, dateSolar: row.date_solar, branch: row.branch, note: row.note });
export const mapPlaceRow = (row) => ({ id: row.id, name: row.name, type: row.type, address: row.address, note: row.note, lat: row.latitude, lng: row.longitude });
export const mapGraveRow = (row) => ({ id: row.id, personId: row.person_id, name: row.name, cemeteryName: row.cemetery_name, graveArea: row.grave_area, graveRow: row.grave_row, graveNumber: row.grave_number, lat: row.latitude, lng: row.longitude, googleMapsUrl: row.google_maps_url, routeNote: row.route_note, status: row.status, note: row.note });
