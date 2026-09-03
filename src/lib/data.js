export async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Không tải được ${path}: ${response.status}`);
  }
  return response.json();
}

export async function loadFamilyData() {
  const [people, events, places, graves] = await Promise.all([
    loadJson('/data/people.json'),
    loadJson('/data/events.json'),
    loadJson('/data/places.json'),
    loadJson('/data/grave-sites.json'),
  ]);

  return { people, events, places, graves };
}
