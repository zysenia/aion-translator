const CACHE_NAME = 'aion-icons-cache-v0.1.1';
const APP_SHELL = [
  '/index.html',
  '/css/style.css',
  '/assets/fonts/Cinzel-VariableFont_wght.ttf',
  '/script/translator.js',
  '/scripts/chat-icon-handler.js',
  '/manifest.json',
  '/resources/chat-icons/metadata.json'
];

// Install: Cache app shell and metadata
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: Clean up old caches if needed
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: Serve from cache, fetch and cache icons/images as needed
self.addEventListener('fetch', event => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(response => {
        // Cache icon images and other requests as needed
        if (
          req.url.endsWith('.png') ||
          req.url.endsWith('.jpg') ||
          req.url.endsWith('.webp')
        ) {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, respClone));
        }
        return response;
      });
    })
  );
});
