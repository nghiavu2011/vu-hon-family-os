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

export function getRoleLevel(role = 'public') {
  return ROLE_HIERARCHY[role] ?? 0;
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
  if (!privacy || privacy === 'public') return true;
  if (privacy === 'family') return getRoleLevel(role) >= getRoleLevel('family_member');
  if (privacy === 'same_branch') return getRoleLevel(role) >= getRoleLevel('same_branch');
  if (privacy === 'editor') return getRoleLevel(role) >= getRoleLevel('editor');
  if (privacy === 'admin' || privacy === 'private') return role === 'admin';
  return false;
}

export function canViewPerson(person, auth) {
  const role = typeof auth === 'string' ? auth : (auth?.role || 'family_member');

  if (role === 'admin' || role === 'editor') return true;
  if (!canViewByPrivacy(person.privacy, role)) return false;

  if (role === 'public') {
    if (isProbablyLiving(person)) return false;
    if (isMinorOrChild(person)) return false;
  }

  if (person.privacy === 'same_branch' && role === 'same_branch') {
    return !auth?.branch || !person.branch || person.branch === auth.branch;
  }

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
  // Bảo vệ an toàn: nếu visiblePeople không phải mảng, trả về toàn bộ events
  if (!Array.isArray(visiblePeople)) return events;
  const visibleIds = new Set(visiblePeople.map((person) => person.id));
  return events.filter((event) => !event.personId || visibleIds.has(event.personId));
}

export function filterGravesByPrivacy(graves = [], visiblePeople = [], auth = {}) {
  if (!Array.isArray(graves)) return [];
  if (!Array.isArray(visiblePeople)) return graves;
  const visibleIds = new Set(visiblePeople.map((person) => person.id));
  // Mộ phần tổ tiên luôn hiển thị cho con cháu chiêm bái và chỉ đường
  return graves.filter((grave) => !grave.personId || visibleIds.has(grave.personId) || Boolean(grave.photos?.length) || Boolean(grave.lat));
}

export function summarizePrivacy(rawPeople = [], visiblePeople = []) {
  const rawList = Array.isArray(rawPeople) ? rawPeople : [];
  const visList = Array.isArray(visiblePeople) ? visiblePeople : [];
  return {
    hidden: Math.max(0, rawList.length - visList.length),
    visible: visList.length,
    total: rawList.length,
  };
}
