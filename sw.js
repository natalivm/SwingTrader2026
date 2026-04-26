const CACHE_NAME = 'swingtrader-v7';
const BASE = self.registration.scope;
const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'styles.css',
  BASE + 'data.js',
  BASE + 'script.js',
  BASE + 'manifest.json',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png',
  BASE + 'icon-192.svg',
  BASE + 'icon-512.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(ASSETS.map(url => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Network-first: always fetch fresh from network, update cache, fall back to
  // cache only when offline so deployed changes are visible immediately.
  event.respondWith(
    fetch(event.request).then(response => {
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      return response;
    }).catch(() =>
      caches.match(event.request).then(cached =>
        cached ||
        new Response('You are offline. Please reconnect to use SwingTrader 2026.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        })
      )
    )
  );
});
