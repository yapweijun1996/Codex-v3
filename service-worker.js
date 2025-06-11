const CACHE_NAME = 'admin-cache-v5';
const ASSETS = [
  './',
  './index.html',
  './settings.html',
  './profile.html',
  './reports.html',
  './analytics.html',
  './tasks.html',
  './calendar.html',
  './users.html',
  './logs.html',
  './status.html',
  './messages.html',
  './help.html',
  './style.min.css',
  './main.min.js',
  './header.js',
  './header.min.js',
  './sidebar.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
  , './api/users.json'
  , './api/logs.json'
  , './api/tasks.json'
  , './api/status.json'
  , './api/events.json'
  , './api/notifications.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.pathname.includes('/api/')) {
    const jsonPath = url.pathname.endsWith('.json')
      ? url.pathname
      : `${url.pathname}.json`;
    const jsonUrl = `${url.origin}${jsonPath}`;
    event.respondWith(
      caches.match(jsonUrl).then(resp => resp || fetch(jsonUrl))
    );
    return;
  }
  event.respondWith(
    caches.match(request).then(resp => resp || fetch(request))
  );
});
