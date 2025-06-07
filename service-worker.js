const CACHE_NAME = 'admin-cache-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/settings.html',
  '/profile.html',
  '/reports.html',
  '/analytics.html',
  '/tasks.html',
  '/calendar.html',
  '/users.html',
  '/logs.html',
  '/status.html',
  '/messages.html',
  '/help.html',
  '/style.min.css',
  '/main.min.js',
  '/header.js',
  '/header.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(resp => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return resp;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  event.respondWith(
    caches.match(request).then(resp => resp || fetch(request))
  );
});
