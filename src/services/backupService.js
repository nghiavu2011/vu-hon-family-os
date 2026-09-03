import { downloadJson } from '../lib/utils.js';

export function createBackupBundle({ people, events, places, graves, meta = {} }) {
  return {
    meta: {
      app: 'Vũ Hồn Family OS',
      version: 'V24 Production Launch',
      exportedAt: new Date().toISOString(),
      privacyNote: 'Không public dữ liệu người sống, trẻ nhỏ, liên hệ cá nhân hoặc tọa độ mộ nếu chưa đủ quyền.',
      ...meta,
    },
    people,
    events,
    places,
    graves,
  };
}

export function exportBackupBundle(data) {
  const bundle = createBackupBundle(data);
  downloadJson(`vu-hon-family-os-backup-${new Date().toISOString().slice(0, 10)}.json`, bundle);
  return bundle;
}

export function exportProductionDataPack({ people, events, places, graves }) {
  downloadJson('people.json', people);
  setTimeout(() => downloadJson('events.json', events), 150);
  setTimeout(() => downloadJson('places.json', places), 300);
  setTimeout(() => downloadJson('grave-sites.json', graves), 450);
}
