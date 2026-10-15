/* Ommi PWA Service Worker — versioned and conservative cache management. */
const CACHE_PREFIX = 'ommy-static-';
const CACHE_VERSION = '20261015-4';
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;
const APP_SHELL = [
  "./index.html",
  "./main.js",
  "./manifest.json",
  "./styles/assistant.css",
  "./styles/base.css",
  "./styles/components.css",
  "./styles/design.css",
  "./styles/growth.css",
  "./styles/modal.css",
  "./styles/nutrition.css",
  "./styles/pregnancy.css",
  "./styles/rainy.css",
  "./styles/responsive.css",
  "./styles/sleep.css",
  "./styles/toast.css",
  "./styles/tokens.css",
  "./styles/vaccines.css",
  "./lib/audio.js",
  "./lib/badges.js",
  "./lib/cloud.js",
  "./lib/content.js",
  "./lib/content2.js",
  "./lib/medications.js",
  "./lib/memories.js",
  "./lib/modal.js",
  "./lib/notifications.js",
  "./lib/settings.js",
  "./lib/social.js",
  "./lib/storage.js",
  "./lib/stories.js",
  "./lib/toast.js",
  "./screens/about.js",
  "./screens/activities.js",
  "./screens/assistant.js",
  "./screens/duas.js",
  "./screens/firstaid.js",
  "./screens/growth.js",
  "./screens/h_main_1791985236.js",
  "./screens/home2.js",
  "./screens/home_v3.js",
  "./screens/hospital-bag.js",
  "./screens/medications.js",
  "./screens/memories.js",
  "./screens/milestones.js",
  "./screens/nutrition.js",
  "./screens/pregnancy-calc.js",
  "./screens/pregnancy.js",
  "./screens/safety.js",
  "./screens/selfcare.js",
  "./screens/settings.js",
  "./screens/sleep.js",
  "./screens/stories.js",
  "./screens/vaccines.js",
  "./components/card.js",
  "./components/stat.js",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon.svg"
];
const OFFLINE_URL = './index.html';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // A missing optional asset must not prevent the whole app from installing offline.
    await Promise.all(APP_SHELL.map(async (url) => {
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok) await cache.put(url, response);
      } catch (_) { /* cached opportunistically; online load can fetch it later */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    // Delete only this application's old cache versions; never touch other apps' caches.
    await Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'OMMI_SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(OFFLINE_URL, response.clone());
        }
        return response;
      } catch (_) {
        return (await caches.match(OFFLINE_URL, { ignoreSearch: true })) ||
          new Response('أُمّي غير متصلة بالإنترنت. افتحي التطبيق بعد الاتصال مرة واحدة لتحميل موارده.', {
            status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
      }
    })());
    return;
  }

  // Cache-first for local app assets, tolerating ?v= cache-busting parameters.
  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === 'basic') {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (_) {
      return new Response('', { status: 504, statusText: 'Offline' });
    }
  })());
});
