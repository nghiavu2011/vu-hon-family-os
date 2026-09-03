import fallbackPeople from '../../data/people.json';
import fallbackEvents from '../../data/events.json';
import fallbackPlaces from '../../data/places.json';
import fallbackGraves from '../../data/grave-sites.json';

const FALLBACK_DATA = {
  '/data/people.json': fallbackPeople,
  '/data/events.json': fallbackEvents,
  '/data/places.json': fallbackPlaces,
  '/data/grave-sites.json': fallbackGraves,
};

async function loadJson(path) {
  const cacheKey = `offline_cache_${path}`;
  try {
    const response = await fetch(path);
    if (response && response.ok) {
      const data = await response.json();
      try {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (e) {
        // Ignore quota limits
      }
      return data;
    }
  } catch (err) {
    console.warn(`Không fetch được ${path}, khôi phục từ bộ nhớ...`, err);
  }

  // 1. Thử lấy từ localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    const local = localStorage.getItem(cacheKey);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        // Parse error ignore
      }
    }
  }

  // 2. Fallback an toàn tuyệt đối từ bản sao lưu được bundle sẵn (Zero Failure)
  if (FALLBACK_DATA[path]) {
    return FALLBACK_DATA[path];
  }

  return [];
}

export async function loadStaticFamilyData() {
  const [people, events, places, graves] = await Promise.all([
    loadJson('/data/people.json'),
    loadJson('/data/events.json'),
    loadJson('/data/places.json'),
    loadJson('/data/grave-sites.json'),
  ]);
  return { people, events, places, graves, source: 'static-json' };
}
