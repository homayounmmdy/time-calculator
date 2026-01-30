const CACHE_NAME = "time-calculator-v1";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./scripts.js",
  "./app.webmanifest",
  "./images/favicon.ico",
  "./images/icons/favicon-16x16.png",
  "./images/icons/favicon-32x32.png",
  "./images/icons/apple-touch-icon.png"
];

// Install → cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate → clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch → offline support
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});