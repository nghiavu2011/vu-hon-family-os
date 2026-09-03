export function stripVietnamese(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

export function formatDate(value) {
  if (!value) return 'Chưa có thông tin';
  const parts = String(value).split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return String(value);
}

export function formatLunar(value) {
  if (!value) return 'Chưa có thông tin';
  const [d, m] = String(value).split('-');
  return `${Number(d)}/${Number(m)} âm lịch`;
}

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function haversine(lat1, lng1, lat2, lng2) {
  const radiusKm = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * radiusKm * Math.asin(Math.sqrt(a));
}

export function buildPeopleIndex(people) {
  return Object.fromEntries(people.map((person) => [person.id, person]));
}

export function getPersonSearchText(person) {
  return stripVietnamese([
    person.name,
    person.branch,
    person.note,
    person.place,
    ...(person.aka || []),
  ].join(' '));
}

export function getBranches(people) {
  return [...new Set(people.map((person) => person.branch).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'vi'));
}
