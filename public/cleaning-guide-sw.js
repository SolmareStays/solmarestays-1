// Service worker for /cleaning-guide.html only (registered with that scope).
// HTML is network-first so guide updates land immediately; the cached copy is
// the offline fallback for dead zones (Casitas, Flora). Images are cache-first.
const SHELL_CACHE = 'cg-shell-v3';
const IMG_CACHE = 'cg-img-v3';
const FONT_CACHE = 'cg-font-v3';
const GUIDE_URL = '/cleaning-guide.html';
const IMG_CACHE_MAX = 340;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.add(GUIDE_URL))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k.startsWith('cg-') && ![SHELL_CACHE, IMG_CACHE, FONT_CACHE].includes(k))
        .map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

async function trimCache(cacheName, maxEntries) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - maxEntries; i++) {
      await cache.delete(keys[i]);
    }
  } catch (e) { /* quota housekeeping is best-effort */ }
}

async function networkFirstShell(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) cache.put(GUIDE_URL, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(GUIDE_URL);
    if (cached) return cached;
    throw e;
  }
}

async function cacheFirst(cacheName, request, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  // Opaque (no-cors S3) responses have status 0 and are still cacheable.
  if (response && (response.ok || response.type === 'opaque')) {
    try {
      await cache.put(request, response.clone());
      if (maxEntries) trimCache(cacheName, maxEntries);
    } catch (e) { /* quota exceeded — serve without caching */ }
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstShell(request));
    return;
  }
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(IMG_CACHE, request, IMG_CACHE_MAX));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(FONT_CACHE, request));
    return;
  }
  // Everything else: default network behavior.
});
