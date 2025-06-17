const CACHE_NAME = 'sinist3rkr3w-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './sinist3rkr3w_trailer.mp4',
  './sky_voiceover.mp3',
  './favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
