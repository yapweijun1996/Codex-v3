const CACHE_NAME = 'admin-cache-v1';
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
  '/style.css',
  '/script.js',
  '/header.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
