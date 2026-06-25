const CACHE_NAME = 'militime-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './images/icon-192.jpeg'
];

// Install stage: cache static UI shell assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate stage: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch stage: Network-first for files, Network-ONLY for the posts data
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // If fetching the JSON data file, bypass the cache entirely
  if (url.pathname.includes('posts.json')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // For app assets, try network first; fall back to cache if offline
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Clone and save fresh asset copies to cache
        if (response.status === 200 && ASSETS.some(asset => e.request.url.includes(asset))) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});