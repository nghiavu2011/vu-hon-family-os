export const ROLES = [
  'public',
  'family_member',
  'same_branch',
  'editor',
  'admin',
];

export const ROLE_LABELS = {
  public: 'Khách vãng lai (Public)',
  family_member: 'Con cháu Nội tộc (Toàn họ)',
  same_branch: 'Người cùng chi phái',
  editor: 'Ban biên tập phả hệ',
  admin: 'Hội đồng Gia tộc (Admin)',
};

export const ROLE_HIERARCHY = {
  public: 0,
  family_member: 1,
  same_branch: 2,
  editor: 3,
  admin: 4,
};

export function getRoleLevel(role = 'family_member') {
  return ROLE_HIERARCHY[role] ?? 1;
}

export function isDeceased(person) {
  return Boolean(
    person?.deathDate
    || person?.deathYear
    || person?.lunarDeath
    || person?.tombLocation
  );
}

export function isProbablyLiving(person) {
  if (person.deathDate || person.deathYear || person.lunarDeath) return false;
  if ((person.gen || 0) >= 5) return true;

  const birthYear = person.birthYear || (person.birthDate ? Number(String(person.birthDate).slice(0, 4)) : null);
  if (birthYear && birthYear >= 1945) return true;

  return false;
}

export function isMinorOrChild(person) {
  const birthYear = person.birthYear || (person.birthDate ? Number(String(person.birthDate).slice(0, 4)) : null);
  if (!birthYear) return false;
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear < 18;
}

export function canViewByPrivacy(privacy, role) {
  if (!privacy || privacy === 'public' || privacy === 'family') return true;
  if (privacy === 'same_branch') return getRoleLevel(role) >= getRoleLevel('same_branch');
  if (privacy === 'editor') return getRoleLevel(role) >= getRoleLevel('editor');
  if (privacy === 'admin' || privacy === 'private') return role === 'admin';
  return true;
}

export function canViewPerson(person, auth) {
  // Trang web gia phả mặc định hiển thị đầy đủ các thế hệ con cháu nối đời cho gia tộc
  return true;
}

export function filterPeopleByPrivacy(people = [], auth = {}) {
  if (!Array.isArray(people)) return [];
  const visible = people.filter((person) => canViewPerson(person, auth));
  const visibleIds = new Set(visible.map((person) => person.id));

  return visible.map((person) => ({
    ...person,
    fatherId: visibleIds.has(person.fatherId) ? person.fatherId : null,
    motherId: visibleIds.has(person.motherId) ? person.motherId : null,
    spouseIds: (person.spouseIds || []).filter((id) => visibleIds.has(id)),
    childrenIds: (person.childrenIds || []).filter((id) => visibleIds.has(id)),
  }));
}

export function filterEventsByPrivacy(events = [], visiblePeople = []) {
  if (!Array.isArray(events)) return [];
  return events;
}

export function filterGravesByPrivacy(graves = [], visiblePeople = [], auth = {}) {
  if (!Array.isArray(graves)) return [];
  return graves;
}

export function summarizePrivacy(rawPeople = [], visiblePeople = []) {
  const rawList = Array.isArray(rawPeople) ? rawPeople : [];
  const visList = Array.isArray(visiblePeople) ? visiblePeople : [];
  return {
    hidden: 0,
    visible: rawList.length,
    total: rawList.length,
  };
}
