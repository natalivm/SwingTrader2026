const CACHE_NAME = 'swingtrader-v2';
const urlsToCache = [
  '/SwingTrader2026/',
  '/SwingTrader2026/index.html',
  '/SwingTrader2026/styles.css',
  '/SwingTrader2026/script.js',
  '/SwingTrader2026/manifest.json',
  '/SwingTrader2026/icon-192.svg',
  '/SwingTrader2026/icon-512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only handle same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    }).catch(() =>
      new Response('You are offline. Please reconnect to use SwingTrader 2026.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      })
    )
  );
});
