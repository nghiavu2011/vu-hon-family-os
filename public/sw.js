const CACHE_NAME = 'vu-hon-family-os-v24.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/seal-vu.png',
  '/assets/hero-gate.png',
  '/assets/bamboo-corner.png',
  '/assets/cloud-red-gold.png',
  '/assets/wood-banner.png',
  '/assets/paper-texture.png',
  '/assets/feature-graves-map.png',
  '/data/people.json',
  '/data/events.json',
  '/data/places.json',
  '/data/grave-sites.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA Cache Assets warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Chỉ xử lý yêu cầu GET và giao thức http/https
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return (await caches.match('/index.html')) || (await caches.match('/'));
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      })
  );
});
