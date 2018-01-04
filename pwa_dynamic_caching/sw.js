// Service worker file
var filesToCache = [
  'static.js'
];

var staticCacheName = 'v1';

self.addEventListener('install', ev => {
  console.log('Service worker install event; caching files');

  ev.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});
